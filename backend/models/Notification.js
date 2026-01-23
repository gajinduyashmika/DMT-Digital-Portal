const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User email
  type: { 
    type: String, 
    enum: ['success', 'warning', 'info', 'default'],
    default: 'info'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: String, default: null }, // Application or Vehicle ID this notification refers to
  relatedType: { 
    type: String, 
    enum: ['application', 'vehicle', 'payment', 'system'],
    default: 'application'
  },
  isRead: { type: Boolean, default: false },
  actionUrl: { type: String, default: null }, // URL to navigate to when clicked
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
