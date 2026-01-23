const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'urgent'],
    default: 'info',
  },
  target: {
    type: String,
    enum: ['all', 'active_users', 'pending_users', 'specific'],
    default: 'all',
  },
  targetEmails: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
