const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  // Owner Information
  ownerEmail: { type: String, required: true },
  fullName: { type: String, required: true },
  nid: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },

  // Vehicle Information
  regNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, required: true, enum: ['Car', 'Bike', 'Van', 'Bus', 'Truck'] },
  chassisNumber: { type: String, required: true },
  engineNumber: { type: String, required: true },
  makeModel: { type: String, required: true },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
  owners: { type: Number, required: true, min: 1 },
  ownershipType: { type: String, required: true, enum: ['Personal', 'Commercial'] },

  // Documents (stored as base64)
  documents: {
    nid: { type: String, required: true },
    invoice: { type: String, required: true },
    insurance: { type: String, required: true },
    emission: { type: String, required: true },
    approval: { type: String, default: null }, // Inspection report
  },

  // Vehicle Image
  vehicleImage: { type: String, default: null },

  // Status
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review']
  },

  // Transfer status
  transferStatus: {
    type: String,
    default: 'None',
    enum: ['None', 'Pending Transfer', 'Completed']
  },

  // Previous Owners History
  previousOwners: [{
    fullName: String,
    address: String,
    nid: String,
    email: String,
    transferredAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
