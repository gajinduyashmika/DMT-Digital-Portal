const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Create a notification
async function createNotification(userId, type, title, message, relatedId, relatedType, actionUrl) {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      actionUrl,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Get all notifications for a user
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const notifications = await Notification.find({ userId: email })
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, updatedAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
});

// Mark all notifications as read for a user
router.put('/user/:email/read-all', async (req, res) => {
  try {
    const { email } = req.params;
    await Notification.updateMany(
      { userId: email, isRead: false },
      { isRead: true, updatedAt: new Date() }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error while updating notifications' });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error while deleting notification' });
  }
});

// Get unread count for a user
router.get('/user/:email/unread-count', async (req, res) => {
  try {
    const { email } = req.params;
    const count = await Notification.countDocuments({ userId: email, isRead: false });
    
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error while fetching unread count' });
  }
});

module.exports = router;
module.exports.createNotification = createNotification;
