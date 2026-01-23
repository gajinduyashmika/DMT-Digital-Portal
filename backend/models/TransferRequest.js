const mongoose = require('mongoose');

const transferRequestSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be null if initiated by seller via NIC only first
    },
    buyerNIC: {
        type: String,
        required: true,
        uppercase: true
    },
    buyerName: {
        type: String,
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    buyerMobile: {
        type: String,
        required: true
    },
    buyerAddress: {
        type: String,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    buyerApprovalStatus: { // New field: Buyer must approve before admin
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    documents: {
        transferForm: { type: String, required: true }, // MTA 6/8
        sellerNicCopy: { type: String, required: true },
        buyerNicCopy: { type: String, required: true },
        revenueLicense: { type: String, required: false },
        insuranceCopy: { type: String, required: false },
        other: { type: String, required: false }
    },
    // Verification Checklist (Admin Side)
    verification: {
        documentsVerified: { type: Boolean, default: false },
        paymentVerified: { type: Boolean, default: false }, // If applicable
        sellerIdentityVerified: { type: Boolean, default: false },
        buyerIdentityVerified: { type: Boolean, default: false },
        notes: { type: String }
    },
    adminComments: {
        type: String // Visible to user
    },
    rejectionReason: {
        type: String // Specific reason code or text
    },
    processedBy: {
        type: String // Admin email/ID
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TransferRequest', transferRequestSchema);
