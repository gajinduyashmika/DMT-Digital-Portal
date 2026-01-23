const express = require('express');
const jwt = require('jsonwebtoken');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all announcements
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { isActive, type } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

// Create announcement
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, content, type, target, targetEmails, expiresAt, adminName, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title,
      content,
      type: type || 'info',
      target: target || 'all',
      targetEmails: targetEmails || [],
      expiresAt,
      createdBy: req.admin.email,
      createdByName: adminName || req.admin.email,
      isActive: true,
      isPinned: !!isPinned,
    });

    await announcement.save();

    // Send notifications to users based on target
    let users = [];
    if (target === 'all') {
      users = await User.find({}).select('email');
    } else if (target === 'active_users') {
      users = await User.find({ status: 'active' }).select('email');
    } else if (target === 'pending_users') {
      users = await User.find({ status: 'pending' }).select('email');
    } else if (target === 'specific' && targetEmails?.length > 0) {
      users = targetEmails.map(email => ({ email }));
    }

    // Create notifications for all target users
    const notifications = users.map(user => ({
      userId: user.email,
      title: `📢 ${title}`,
      message: content,
      type: type === 'urgent' ? 'warning' : (type || 'info'),
      relatedType: 'system',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: adminName || req.admin.email,
      action: 'ANNOUNCEMENT_CREATED',
      targetType: 'announcement',
      targetId: announcement._id.toString(),
      details: { title, target, recipientCount: users.length },
    });

    res.status(201).json({
      message: 'Announcement created and sent to ' + users.length + ' users',
      announcement,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});

// Update announcement
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, content, type, isActive, expiresAt, isPinned } = req.body;

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, type, isActive, expiresAt, isPinned },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement updated', announcement });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Failed to update announcement' });
  }
});

// Delete announcement
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
});

// =====================
// AUDIT LOGS
// =====================

router.get('/audit-logs', verifyAdmin, async (req, res) => {
  try {
    const { action, adminEmail, search, actorType, page = 1, limit = 50 } = req.query;

    let query = {};

    // Exact filters
    if (action && action !== 'all') {
      query.action = action;
    }

    // Actor Type filter (Admin vs User tabs)
    if (actorType) {
      if (actorType === 'Admin') {
        // Match explicit Admin or where actorType is missing (legacy logs assumed Admin)
        query.$or = [{ actorType: 'Admin' }, { actorType: { $exists: false } }];
      } else {
        query.actorType = actorType;
      }
    }

    // Search filter
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchConditions = [
        { actorName: searchRegex },
        { actorEmail: searchRegex },
        { adminName: searchRegex },
        { adminEmail: searchRegex },
        { userEmail: searchRegex },
        { targetId: searchRegex },
        { 'details.registrationNumber': searchRegex }, // Search inside details for common things
        { 'details.reason': searchRegex }
      ];

      // Merge with existing query
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: searchConditions }
        ];
        delete query.$or; // Remove the top-level $or to avoid conflict
      } else {
        query.$or = searchConditions;
      }
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('adminId', 'name email') // Populate admin details if available
      .populate('userId', 'fullName email'); // Populate user details if available

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
