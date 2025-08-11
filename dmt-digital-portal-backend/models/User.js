const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nationalId: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
