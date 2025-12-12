const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  // Owner Information
  ownerEmail: { type: String, required: true },
  ownerName: { type: String, required: true },
  nationalIdNo: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  permanentAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  occupation: { type: String, default: '' },
  
  // Vehicle Information
  registrationNumber: { type: String, required: true, unique: true },
  vehicleClass: { type: String, required: true },
  makeOfVehicle: { type: String, required: true },
  modelOfVehicle: { type: String, required: true },
  yearOfManufacture: { type: Number, required: true },
  engineNumber: { type: String, required: true },
  chassisNumber: { type: String, required: true },
  colorOfVehicle: { type: String, required: true },
  fuelType: { type: String, required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'] },
  engineCapacity: { type: String, default: '' },
  numberOfCylinders: { type: Number, default: 0 },
  
  // Vehicle Details
  importedOrLocal: { type: String, enum: ['Imported', 'Local'], default: 'Local' },
  emissionStandard: { type: String, default: '' },
  noOfOwners: { type: Number, required: true, min: 1 },
  
  // Documents (stored as base64)
  documents: {
    nidCopy: { type: String, required: true },
    invoiceProof: { type: String, required: true },
    insuranceDocument: { type: String, required: true },
    emissionTest: { type: String, required: true },
    inspectionReport: { type: String, default: null },
  },
  
  // Application Status
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review']
  },
  
  // Admin Notes
  adminNotes: { type: String, default: '' },
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
