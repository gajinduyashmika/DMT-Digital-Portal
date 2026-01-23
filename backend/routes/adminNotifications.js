const express = require('express');
const jwt = require('jsonwebtoken');
const AdminNotification = require('../models/AdminNotification');
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

// Get all admin notifications
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, type, audience, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.type = type;
    if (audience && audience !== 'all') query.audience = audience;
    
    const notifications = await AdminNotification.find(query)
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await AdminNotification.countDocuments(query);
    
    res.json({
      notifications,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Get notification stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalSent = await AdminNotification.countDocuments({ status: 'sent' });
    const scheduled = await AdminNotification.countDocuments({ status: 'scheduled' });
    const drafts = await AdminNotification.countDocuments({ status: 'draft' });
    
    // Get total views and acknowledgements
    const sentNotifications = await AdminNotification.find({ status: 'sent' });
    const totalViews = sentNotifications.reduce((sum, n) => sum + n.viewCount, 0);
    const totalAcknowledgements = sentNotifications.reduce((sum, n) => sum + n.acknowledgements, 0);
    
    res.json({
      totalSent,
      scheduled,
      drafts,
      totalViews,
      totalAcknowledgements
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Create a new notification
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, message, type, audience, targetUsers, channels, scheduledFor, expiryDate, priority } = req.body;
    
    // Determine status based on scheduledFor
    let status = 'draft';
    if (scheduledFor) {
      const scheduleDate = new Date(scheduledFor);
      if (scheduleDate > new Date()) {
        status = 'scheduled';
      } else {
        status = 'sent';
      }
    }
    
    const notification = new AdminNotification({
      title,
      message,
      type: type || 'info',
      audience: audience || 'global',
      targetUsers: targetUsers || [],
      channels: channels || ['web'],
      status,
      sentBy: req.admin.adminId,
      scheduledFor: scheduledFor || null,
      expiryDate: expiryDate || null,
      priority: priority || 'medium'
    });
    
    await notification.save();
    
    // If sending immediately (not scheduled), create individual notifications for users
    if (!scheduledFor) {
      await sendNotificationToUsers(notification);
      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    }
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: 'NOTIFICATION_CREATE',
      targetType: 'notification',
      targetId: notification._id.toString(),
      details: { title, audience, status },
      ipAddress: req.ip
    }).save();
    
    res.status(201).json({ 
      message: 'Notification created successfully', 
      notification 
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
});

// Send notification immediately
router.post('/:id/send', verifyAdmin, async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.status === 'sent') {
      return res.status(400).json({ message: 'Notification already sent' });
    }
    
    // Send to users
    await sendNotificationToUsers(notification);
    
    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: 'NOTIFICATION_SEND',
      targetType: 'notification',
      targetId: notification._id.toString(),
      details: { title: notification.title },
      ipAddress: req.ip
    }).save();
    
    res.json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});

// Update notification (only drafts and scheduled)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.status === 'sent') {
      return res.status(400).json({ message: 'Cannot edit a sent notification' });
    }
    
    const { title, message, type, audience, targetUsers, channels, scheduledFor, expiryDate, priority } = req.body;
    
    if (title) notification.title = title;
    if (message) notification.message = message;
    if (type) notification.type = type;
    if (audience) notification.audience = audience;
    if (targetUsers) notification.targetUsers = targetUsers;
    if (channels) notification.channels = channels;
    if (scheduledFor !== undefined) {
      notification.scheduledFor = scheduledFor || null;
      notification.status = scheduledFor ? 'scheduled' : 'draft';
    }
    if (expiryDate !== undefined) notification.expiryDate = expiryDate || null;
    if (priority) notification.priority = priority;
    
    await notification.save();
    
    res.json({ message: 'Notification updated successfully', notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// Delete notification
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: 'NOTIFICATION_DELETE',
      targetType: 'notification',
      targetId: req.params.id,
      details: { title: notification.title },
      ipAddress: req.ip
    }).save();
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Get single notification
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.id)
      .populate('sentBy', 'name email');
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ message: 'Failed to fetch notification' });
  }
});

// Helper function to send notifications to users
async function sendNotificationToUsers(adminNotification) {
  try {
    let targetEmails = [];
    
    if (adminNotification.audience === 'global' || adminNotification.audience === 'users') {
      // Get all user emails
      const users = await User.find({ status: { $ne: 'blocked' } }).select('email');
      targetEmails = users.map(u => u.email);
    } else if (adminNotification.audience === 'specific' && adminNotification.targetUsers.length > 0) {
      targetEmails = adminNotification.targetUsers;
    }
    
    // Create individual notifications for each user
    const notifications = targetEmails.map(email => ({
      userId: email,
      type: adminNotification.type === 'warning' ? 'warning' : 
            adminNotification.type === 'error' ? 'error' : 'info',
      title: adminNotification.title,
      message: adminNotification.message,
      relatedType: 'announcement'
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    return notifications.length;
  } catch (error) {
    console.error('Error sending notifications to users:', error);
    throw error;
  }
}

module.exports = router;
