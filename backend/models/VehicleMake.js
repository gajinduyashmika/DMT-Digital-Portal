const mongoose = require('mongoose');

const VehicleMakeSchema = new mongoose.Schema({
  make: { type: String, required: true, unique: true },
  models: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VehicleMake', VehicleMakeSchema);
