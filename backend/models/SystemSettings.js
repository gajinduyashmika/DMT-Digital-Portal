const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  modules: {
    liveChat: { type: Boolean, default: true },
    ocr: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    documentVerification: { type: Boolean, default: true },
    ownershipTransfer: { type: Boolean, default: true }
  },
  email: {
    smtpHost: { type: String, default: 'smtp.gov.lk' },
    smtpPort: { type: Number, default: 587 },
    username: { type: String, default: 'noreply@dmt.gov.lk' },
    encryption: { type: String, default: 'tls' }
  },
  fileUpload: {
    maxFileSize: { type: Number, default: 10 }, // MB
    allowedTypes: { type: [String], default: ['pdf', 'jpg', 'jpeg', 'png'] },
    maxDocumentsPerApplication: { type: Number, default: 10 }
  },
  multilingual: {
    enableSinhala: { type: Boolean, default: true },
    enableTamil: { type: Boolean, default: true },
    enableEnglish: { type: Boolean, default: true },
    defaultLanguage: { type: String, default: 'english' }
  },
  certificate: {
    headerText: { type: String, default: 'Department of Motor Traffic - Sri Lanka' },
    footerText: { type: String, default: 'This is an official government document' },
    enableWatermark: { type: Boolean, default: true },
    signatoryName: { type: String, default: 'Commissioner of Motor Traffic' },
    signatoryTitle: { type: String, default: 'Commissioner' }
  },
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: 'The system is currently under maintenance. Please try again later.' },
    scheduledStart: { type: Date, default: null },
    scheduledEnd: { type: Date, default: null }
  },
  security: {
    sessionTimeout: { type: Number, default: 30 }, // minutes
    forcePasswordReset: { type: Number, default: 90 }, // days
    enable2FA: { type: Boolean, default: false },
    maxLoginAttempts: { type: Number, default: 5 }
  },
  support: {
    hours: { type: String, default: '8:00 AM - 5:00 PM (Monday to Friday)' },
    phone: { type: String, default: '+94-11-2691691' },
    email: { type: String, default: 'support@dmt.gov.lk' },
    address: { type: String, default: 'Department of Motor Traffic, Werahera, Boralesgamuwa' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
