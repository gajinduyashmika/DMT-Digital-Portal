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
  // Registration number is assigned by department after approval
  registrationNumber: { type: String, default: null, unique: false },
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

  // Vehicle Image (stored as base64)
  vehicleImage: { type: String, default: null },

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
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review', 'Cancelled']
  },

  // Payment Info
  paymentReference: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  vipRequested: { type: Boolean, default: false },
  vipNumber: { type: String, default: null },
  vipFee: { type: Number, default: 0 },

  // Admin Review & Comments
  adminNotes: { type: String, default: '' },
  adminComments: { type: String, default: '' }, // Comments for client to see
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null },

  // Detailed Field Review
  reviewProgress: { type: Number, default: 0 }, // 0 to 100
  fieldReviews: {
    ownerDetails: {
      status: { type: String, enum: ['Pending', 'Correct', 'Incorrect'], default: 'Pending' },
      comment: { type: String, default: '' }
    },
    vehicleDetails: {
      status: { type: String, enum: ['Pending', 'Correct', 'Incorrect'], default: 'Pending' },
      comment: { type: String, default: '' }
    },
    documents: {
      status: { type: String, enum: ['Pending', 'Correct', 'Incorrect'], default: 'Pending' },
      comment: { type: String, default: '' }
    },
    payment: {
      status: { type: String, enum: ['Pending', 'Correct', 'Incorrect'], default: 'Pending' },
      comment: { type: String, default: '' }
    }
  },

}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
