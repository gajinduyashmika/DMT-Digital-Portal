const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  actorType: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'Admin',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  adminEmail: {
    type: String,
  },
  adminName: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userEmail: {
    type: String,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'REGISTER',
      'APPLICATION_SUBMITTED',
      'APPLICATION_APPROVED',
      'APPLICATION_REJECTED',
      'APPLICATION_CORRECTION',
      'USER_BLOCKED',
      'USER_UNBLOCKED',
      'USER_VERIFIED',
      'TICKET_RESPONDED',
      'TICKET_CLOSED',
      'ANNOUNCEMENT_CREATED',
      'NOTIFICATION_SENT',
      'SETTINGS_CHANGED',
      'STAFF_CREATED',
      'STAFF_UPDATED',
      'STAFF_DELETED',
      'VIEW',
    ],
  },
  targetType: {
    type: String,
    enum: ['user', 'application', 'vehicle', 'ticket', 'announcement', 'notification', 'staff', 'system'],
  },
  targetId: {
    type: String,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
