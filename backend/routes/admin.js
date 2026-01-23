const express = require('express');
const jwt = require('jsonwebtoken');
const Application = require('../models/Application');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

const verifyAdmin = require('../middleware/adminAuth');

// =====================
// DASHBOARD STATS
// =====================

router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const approvedApplications = await Application.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });
    const openTickets = await Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } });

    // Get recent activity
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('ownerEmail ownerName status createdAt vehicleClass');

    res.json({
      totalVehicles,
      totalUsers,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      openTickets,
      recentApplications,
      applicationsByStatus: {
        approved: approvedApplications,
        pending: pendingApplications,
        rejected: rejectedApplications,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// =====================
// APPLICATION MANAGEMENT
// =====================

// Get all applications
router.get('/applications', verifyAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { ownerEmail: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { chassisNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .select('-documents -vehicleImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({
      applications,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get single application
// Get single application (metadata only - admin)
router.get('/applications/:id', verifyAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('-documents -vehicleImage');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

// Get application resources (documents and images - admin)
router.get('/applications/:id/resources', verifyAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('documents vehicleImage');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Get application resources error:', error);
    res.status(500).json({ message: 'Failed to fetch application resources' });
  }
});

// Update review progress
router.put('/applications/:id/review', verifyAdmin, async (req, res) => {
  try {
    const { fieldReviews, reviewProgress, status } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.fieldReviews = fieldReviews || application.fieldReviews;
    application.reviewProgress = reviewProgress !== undefined ? reviewProgress : application.reviewProgress;

    // Optional: Update status to 'Under Review' if not already
    if (status) {
      application.status = status;
    } else if (application.status === 'Pending') {
      application.status = 'Under Review';
    }

    await application.save();

    // Audit log (optional, maybe too noisy if auto-saved frequently, but good for tracking)
    // keeping it minimal or only on explicit save

    res.json({ message: 'Review progress saved', application });
  } catch (error) {
    console.error('Review update error:', error);
    res.status(500).json({ message: 'Failed to update review progress' });
  }
});

// Approve application
router.put('/applications/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { registrationNumber, adminComments, adminNotes, bypassReview } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify all fields are marked Correct unless bypassed
    if (!bypassReview) {
      const reviews = application.fieldReviews || {};
      const sections = ['ownerDetails', 'vehicleDetails', 'documents', 'payment'];
      const pendingOrIncorrect = sections.filter(section =>
        !reviews[section] || reviews[section].status !== 'Correct'
      );

      if (pendingOrIncorrect.length > 0) {
        return res.status(400).json({
          message: 'Cannot approve: All sections must be marked as Correct.',
          pendingSections: pendingOrIncorrect
        });
      }
    }

    application.status = 'Approved';
    application.registrationNumber = registrationNumber || application.vipNumber || `REG-${Date.now()}`;
    application.adminComments = adminComments || ''; // Visible to client
    application.adminNotes = adminNotes || ''; // Internal notes
    application.reviewedAt = new Date();
    application.reviewedBy = req.admin.email;
    application.reviewProgress = 100; // Ensure 100%
    await application.save();

    // Create/update vehicle record
    // Create/update vehicle record
    const vehicleData = {
      ownerEmail: application.ownerEmail,
      fullName: application.ownerName,
      nid: application.nationalIdNo,
      phone: application.phoneNumber,
      email: application.emailAddress,
      address: application.permanentAddress,
      regNumber: application.registrationNumber,
      vehicleType: application.vehicleClass === 'Motorcycle' ? 'Bike' : (['Car', 'Van', 'Bus', 'Truck'].includes(application.vehicleClass) ? application.vehicleClass : 'Car'),
      makeModel: `${application.makeOfVehicle} ${application.modelOfVehicle}`,
      fuelType: application.fuelType,
      year: application.yearOfManufacture,
      owners: application.noOfOwners,
      ownershipType: 'Personal',
      documents: {
        nid: application.documents.nidCopy,
        invoice: application.documents.invoiceProof,
        insurance: application.documents.insuranceDocument,
        emission: application.documents.emissionTest,
        approval: application.documents.inspectionReport || null
      },
      chassisNumber: application.chassisNumber,
      engineNumber: application.engineNumber,
      status: 'Approved',
    };

    console.log('Attempting to upsert vehicle with data:', JSON.stringify(vehicleData, null, 2));

    try {
      const updatedVehicle = await Vehicle.findOneAndUpdate(
        { chassisNumber: application.chassisNumber },
        vehicleData,
        { upsert: true, new: true, runValidators: true } // Ensure validators run
      );
      console.log('Vehicle upsert successful:', updatedVehicle._id);
    } catch (upsertError) {
      console.error('CRITICAL: Vehicle upsert failed:', upsertError);
      // We do not return here to avoid breaking the "Application Approved" flow, but we log strictly.
      // Or should we fail? User expects vehicle.
      // return res.status(500).json({ message: 'Approved, but failed to create vehicle record: ' + upsertError.message });
      // Actually, better to fail the request so the admin knows.
      throw new Error('Vehicle creation failed: ' + upsertError.message);
    }

    // Send notification to user
    await Notification.create({
      userId: application.ownerEmail,
      title: 'Application Approved',
      message: `Your vehicle registration application has been approved. Registration Number: ${application.registrationNumber}${adminComments ? '. ' + adminComments : ''}`,
      type: 'success',
      relatedType: 'application',
      relatedId: application._id.toString(),
    });

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'APPLICATION_APPROVED',
      targetType: 'application',
      targetId: application._id.toString(),
      details: { registrationNumber: application.registrationNumber, adminComments, adminNotes },
    });

    res.json({ message: 'Application approved successfully', application });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({ message: 'Failed to approve application' });
  }
});

// Reject application
router.put('/applications/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { reason, adminComments, adminNotes } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'Rejected';
    application.rejectionReason = reason;
    application.adminComments = adminComments || reason; // Visible to client
    application.adminNotes = adminNotes || ''; // Internal notes
    application.reviewedAt = new Date();
    application.reviewedBy = req.admin.email;
    await application.save();

    // Send notification to user
    await Notification.create({
      userId: application.ownerEmail,
      title: 'Application Rejected',
      message: `Your vehicle registration application has been rejected. ${adminComments || reason}`,
      type: 'warning',
      relatedType: 'application',
      relatedId: application._id.toString(),
    });

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'APPLICATION_REJECTED',
      targetType: 'application',
      targetId: application._id.toString(),
      details: { reason, adminComments, adminNotes },
    });

    res.json({ message: 'Application rejected', application });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({ message: 'Failed to reject application' });
  }
});

// Request correction
router.put('/applications/:id/correction', verifyAdmin, async (req, res) => {
  try {
    const { fields, message } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'correction_needed';
    application.correctionFields = fields;
    application.correctionMessage = message;
    await application.save();

    // Send notification to user
    await Notification.create({
      userId: application.ownerEmail,
      title: 'Correction Required',
      message: `Your application requires corrections. Please review and update: ${message}`,
      type: 'warning',
      relatedType: 'application',
      relatedId: application._id.toString(),
    });

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'APPLICATION_CORRECTION',
      targetType: 'application',
      targetId: application._id.toString(),
      details: { fields, message },
    });

    res.json({ message: 'Correction requested', application });
  } catch (error) {
    console.error('Correction request error:', error);
    res.status(500).json({ message: 'Failed to request correction' });
  }
});

// =====================
// USER MANAGEMENT
// =====================

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get vehicle count for each user
    const usersWithVehicles = await Promise.all(users.map(async (user) => {
      const vehicleCount = await Vehicle.countDocuments({ ownerEmail: user.email });
      const applicationCount = await Application.countDocuments({ ownerEmail: user.email });
      return {
        ...user.toObject(),
        vehicleCount,
        applicationCount,
      };
    }));

    res.json({
      users: usersWithVehicles,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const vehicles = await Vehicle.find({ ownerEmail: user.email }).select('-documents -vehicleImage');
    const applications = await Application.find({ ownerEmail: user.email }).select('-documents -vehicleImage');

    res.json({
      user,
      vehicles,
      applications,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Block user
router.put('/users/:id/block', verifyAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'blocked', blockReason: reason },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'USER_BLOCKED',
      targetType: 'user',
      targetId: user._id.toString(),
      details: { reason },
    });

    res.json({ message: 'User blocked', user });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Failed to block user' });
  }
});

// Unblock user
router.put('/users/:id/unblock', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active', blockReason: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'USER_UNBLOCKED',
      targetType: 'user',
      targetId: user._id.toString(),
    });

    res.json({ message: 'User unblocked', user });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ message: 'Failed to unblock user' });
  }
});

// Send notification to specific user
router.post('/users/:id/notify', verifyAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = await Notification.create({
      userId: user.email,
      title,
      message,
      type: type || 'info',
    });

    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'NOTIFICATION_SENT',
      targetType: 'user',
      targetId: user._id.toString(),
      details: { title, message },
    });

    res.json({ message: 'Notification sent', notification });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});


// =====================
// TRANSFER MANAGEMENT
// =====================

// Get all transfer requests
router.get('/transfers', verifyAdmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    // Search logic for transfers (by RegNo, Buyer Name, Seller Email)
    if (search) {
      // We need to look up vehicles solely to get their IDs if we want to search by RegNo
      // But simpler approach: Use aggregation or populate.
      // For now, let's search fields directly on TransferRequest + basic populate
      // Mongoose search on populated fields is tricky without aggregation.
      // Let's stick to searching fields present in TransferRequest first: buyerName, buyerNIC, buyerEmail
      query.$or = [
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerNIC: { $regex: search, $options: 'i' } },
        { buyerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const transfers = await require('../models/TransferRequest').find(query)
      .populate('vehicleId', 'regNumber makeModel')
      .populate('sellerId', 'fullName email') // Populate seller details
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await require('../models/TransferRequest').countDocuments(query);

    res.json({
      transfers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: 'Failed to fetch transfer requests' });
  }
});

// Get single transfer detailed view
router.get('/transfers/:id', verifyAdmin, async (req, res) => {
  try {
    const transfer = await require('../models/TransferRequest').findById(req.params.id)
      .populate('vehicleId') // Full vehicle details for comparison
      .populate('sellerId', 'fullName email phone nid address'); // Full seller details

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer request not found' });
    }
    res.json(transfer);
  } catch (error) {
    console.error('Get transfer detail error:', error);
    res.status(500).json({ message: 'Failed to fetch transfer details' });
  }
});

// Verify transfer documents/checklist
router.put('/transfers/:id/verify', verifyAdmin, async (req, res) => {
  try {
    const { verification } = req.body;
    const transfer = await require('../models/TransferRequest').findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer request not found' });
    }

    // Merge verification updates
    transfer.verification = { ...transfer.verification, ...verification };
    await transfer.save();

    res.json({ message: 'Verification checklist updated', transfer });
  } catch (error) {
    console.error('Verify transfer error:', error);
    res.status(500).json({ message: 'Failed to update verification' });
  }
});

// Approve Transfer
router.put('/transfers/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { adminComments, adminNotes } = req.body;
    const TransferRequest = require('../models/TransferRequest');

    const transfer = await TransferRequest.findById(req.params.id).populate('sellerId');
    if (!transfer) return res.status(404).json({ message: 'Request not found' });

    if (transfer.status !== 'pending') {
      return res.status(400).json({ message: 'Request is handled already' });
    }

    if (transfer.buyerApprovalStatus !== 'approved') {
      return res.status(400).json({ message: 'Buyer has not approved the transfer yet.' });
    }

    // 1. Update Transfer Status
    transfer.status = 'approved';
    transfer.adminComments = adminComments;
    transfer.verification.notes = adminNotes; // Save admin internal notes
    transfer.processedBy = req.admin.email;
    transfer.updatedAt = Date.now();
    await transfer.save();

    // 2. Perform Ownership Transfer on Vehicle
    const Vehicle = require('../models/Vehicle');
    const vehicle = await Vehicle.findById(transfer.vehicleId);
    if (!vehicle) throw new Error('Vehicle not found during approval');

    // Archive Current Owner
    vehicle.previousOwners.push({
      fullName: vehicle.fullName,
      address: vehicle.address,
      nid: vehicle.nid,
      email: vehicle.ownerEmail, // or vehicle.email
      transferredAt: new Date()
    });

    // Update Owner Details
    vehicle.ownerEmail = transfer.buyerEmail;
    vehicle.fullName = transfer.buyerName;
    vehicle.nid = transfer.buyerNIC;
    vehicle.phone = transfer.buyerMobile;
    vehicle.email = transfer.buyerEmail;
    vehicle.address = transfer.buyerAddress;

    // Reset transfer status
    vehicle.transferStatus = 'Completed';
    // Add to history (if we had a history array, simpler to just audit log it)

    await vehicle.save();

    // 3. Notify Users (Old and New)

    // Notify Old Owner (Seller) - Check if seller exists (User might be deleted)
    if (transfer.sellerId && transfer.sellerId.email) {
      try {
        await Notification.create({
          userId: transfer.sellerId.email,
          title: 'Vehicle Transfer Completed',
          message: `Ownership of vehicle ${vehicle.regNumber} has been successfully transferred to ${transfer.buyerName}.`,
          type: 'success',
          relatedId: transfer._id,
          relatedType: 'vehicle'
        });
      } catch (notifyError) {
        console.error('Failed to notify seller:', notifyError);
      }
    } else {
      console.warn('Seller not found or email missing, skipping notification for:', transfer.sellerId);
    }

    // Notify New Owner (Buyer)
    if (transfer.buyerEmail) {
      try {
        await Notification.create({
          userId: transfer.buyerEmail,
          title: 'Transfer Approved - You are the new owner!',
          message: `Congratulations! The transfer of ownership for vehicle ${vehicle.regNumber} has been approved by DMT. You are now the registered owner.`,
          type: 'success',
          relatedId: transfer._id,
          relatedType: 'vehicle',
          actionUrl: '/my-vehicles'
        });
      } catch (notifyError) {
        console.error('Failed to notify buyer:', notifyError);
      }
    }

    // 4. Audit Log
    try {
      await AuditLog.create({
        adminId: req.admin.id,
        action: 'TRANSFER_APPROVED',
        targetType: 'vehicle',
        targetId: vehicle._id.toString(),
        details: { transferId: transfer._id, newOwner: transfer.buyerName }
      });
    } catch (auditError) {
      console.error('Audit log failed:', auditError);
    }

    res.json({ message: 'Transfer approved and ownership updated.', transfer });

  } catch (error) {
    console.error('Approve transfer error:', error);
    res.status(500).json({ message: 'Failed to approve transfer' });
  }
});

// Reject Transfer
router.put('/transfers/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const { reason, adminComments } = req.body;
    const TransferRequest = require('../models/TransferRequest');

    const transfer = await TransferRequest.findById(req.params.id).populate('sellerId');
    if (!transfer) return res.status(404).json({ message: 'Request not found' });

    transfer.status = 'rejected';
    transfer.rejectionReason = reason;
    transfer.adminComments = adminComments;
    transfer.processedBy = req.admin.email;
    transfer.updatedAt = Date.now();
    await transfer.save();

    // Revert Vehicle Status
    const Vehicle = require('../models/Vehicle');
    await Vehicle.findByIdAndUpdate(transfer.vehicleId, { transferStatus: 'None' });

    // Notify Seller
    if (transfer.sellerId && transfer.sellerId.email) {
      try {
        await Notification.create({
          userId: transfer.sellerId.email,
          title: 'Transfer Request Rejected',
          message: `Transfer request was rejected by Admin. Reason: ${reason}. ${adminComments || ''}`,
          type: 'error',
          relatedId: transfer._id,
          relatedType: 'vehicle'
        });
      } catch (e) { console.error('Notify seller failed:', e); }
    }

    // Notify Buyer
    if (transfer.buyerEmail) {
      try {
        await Notification.create({
          userId: transfer.buyerEmail,
          title: 'Transfer Request Rejected',
          message: `The transfer request for vehicle was rejected by DMT Admin. Reason: ${reason}.`,
          type: 'error',
          relatedId: transfer._id,
          relatedType: 'vehicle'
        });
      } catch (e) { console.error('Notify buyer failed:', e); }
    }

    res.json({ message: 'Transfer rejected.', transfer });

  } catch (error) {
    console.error('Reject transfer error:', error);
    res.status(500).json({ message: 'Failed to reject transfer' });
  }
});

module.exports = router;
