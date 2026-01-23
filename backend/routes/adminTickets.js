const express = require('express');
const jwt = require('jsonwebtoken');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware to verify admin token
const verifyAdmin = require('../middleware/adminAuth');

// Get all tickets (for admin)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(query);

    // Get counts by status
    const openCount = await Ticket.countDocuments({ status: 'Open' });
    const inProgressCount = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Ticket.countDocuments({ status: 'Resolved' });
    const closedCount = await Ticket.countDocuments({ status: 'Closed' });

    res.json({
      tickets,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      counts: {
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Get single ticket
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
});

// Reply to ticket (admin)
router.post('/:id/reply', verifyAdmin, async (req, res) => {
  try {
    const { message, adminName, adminEmail } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.messages.push({
      senderEmail: adminEmail || req.admin.email,
      senderName: adminName || 'Admin',
      isAdmin: true,
      message,
      timestamp: new Date(),
    });

    // Auto-update status to In Progress if Open
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    ticket.assignedTo = adminEmail || req.admin.email;
    await ticket.save();

    // Notify user
    await Notification.create({
      userId: ticket.userEmail,
      title: 'New Reply to Your Ticket',
      message: `You have a new response on your ticket: "${ticket.title}"`,
      type: 'info',
    });

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: adminName || req.admin.email,
      action: 'TICKET_RESPONDED',
      targetType: 'ticket',
      targetId: ticket._id.toString(),
      details: { ticketTitle: ticket.title },
    });

    res.json({ message: 'Reply sent successfully', ticket });
  } catch (error) {
    console.error('Reply ticket error:', error);
    res.status(500).json({ message: 'Failed to reply to ticket' });
  }
});

// Update ticket status
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Notify user
    await Notification.create({
      userId: ticket.userEmail,
      title: 'Ticket Status Updated',
      message: `Your ticket "${ticket.title}" status has been updated to: ${status}`,
      type: status === 'Resolved' ? 'success' : 'info',
    });

    res.json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Failed to update ticket status' });
  }
});

// Close ticket (admin)
router.put('/:id/close', verifyAdmin, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed' },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Notify user
    await Notification.create({
      userId: ticket.userEmail,
      title: 'Ticket Closed',
      message: `Your ticket "${ticket.title}" has been closed.`,
      type: 'info',
    });

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'TICKET_CLOSED',
      targetType: 'ticket',
      targetId: ticket._id.toString(),
      details: { ticketTitle: ticket.title },
    });

    res.json({ message: 'Ticket closed', ticket });
  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({ message: 'Failed to close ticket' });
  }
});

// Assign ticket to admin
router.put('/:id/assign', verifyAdmin, async (req, res) => {
  try {
    const { assignedTo, assignedName } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedTo, assignedName, status: 'In Progress' },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket assigned', ticket });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Failed to assign ticket' });
  }
});

module.exports = router;
