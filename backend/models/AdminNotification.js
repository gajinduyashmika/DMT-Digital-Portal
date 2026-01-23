const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info'
  },
  audience: {
    type: String,
    enum: ['global', 'users', 'staff', 'specific'],
    default: 'global'
  },
  targetUsers: [{
    type: String // email addresses for specific users
  }],
  channels: [{
    type: String,
    enum: ['web', 'email', 'sms']
  }],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'expired'],
    default: 'draft'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  sentAt: {
    type: Date,
    default: null
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  acknowledgements: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
