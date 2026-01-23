const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'registration_officer', 'ownership_officer', 'document_verifier', 'communication_admin', 'auditor'],
    default: 'registration_officer',
  },
  department: {
    type: String,
    default: 'General',
  },
  nic: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  profilePicture: {
    type: String,
    default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
