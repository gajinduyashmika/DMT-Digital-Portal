const express = require('express');
const router = express.Router();
const TransferRequest = require('../models/TransferRequest');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth'); // User authentication

// =====================
// USER ROUTES
// =====================

// Initiate a transfer request
router.post('/initiate', auth, async (req, res) => {
    console.log('--- Transfer Initiate Request START ---');
    try {
        console.log('User:', req.user);
        console.log('Body:', JSON.stringify(req.body, (key, value) => {
            // truncate long base64 strings in log
            if (value && typeof value === 'string' && value.length > 100 && key !== 'buyerAddress') {
                return value.substring(0, 50) + '...[truncated]';
            }
            return value;
        }, 2));

        const {
            vehicleId,
            buyerNIC,
            buyerName,
            buyerEmail,
            buyerMobile,
            buyerAddress,
            salePrice,
            documents = {}
        } = req.body;

        if (!vehicleId) {
            throw new Error('vehicleId is missing in request body');
        }

        // 1. Validate Vehicle Ownership
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            console.log('Vehicle not found:', vehicleId);
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Strict check: Logged in user must be the owner
        if (vehicle.ownerEmail !== req.user.email) {
            console.log('Owner mismatch:', vehicle.ownerEmail, '!==', req.user.email);
            return res.status(403).json({ message: 'You are not authorized to transfer this vehicle.' });
        }

        // 2. Check for Existing Pending Requests
        const existingRequest = await TransferRequest.findOne({
            vehicleId: vehicleId,
            status: 'pending'
        });
        if (existingRequest) {
            console.log('Existing pending request found');
            return res.status(400).json({ message: 'A pending transfer request already exists for this vehicle.' });
        }

        // 3. Validate Buyer Exists
        const buyerUser = await User.findOne({ email: buyerEmail });
        if (!buyerUser) {
            return res.status(404).json({ message: 'Buyer email not found in our system. The new owner must be registered.' });
        }

        // 3. Create Request
        console.log('Creating TransferRequest object...');
        const newRequest = new TransferRequest({
            vehicleId,
            sellerId: req.user.id, // ID from auth middleware
            buyerNIC,
            buyerName,
            buyerEmail,
            buyerMobile,
            buyerAddress,
            salePrice,
            documents: {
                transferForm: documents.transferForm,
                sellerNicCopy: documents.sellerNicCopy,
                buyerNicCopy: documents.buyerNicCopy,
                revenueLicense: documents.revenueLicense,
                insuranceCopy: documents.insuranceCopy,
                other: documents.other
            },
            status: 'pending'
        });

        console.log('Saving TransferRequest...');
        await newRequest.save();
        console.log('TransferRequest saved:', newRequest._id);

        // 4. Update Vehicle Status
        vehicle.transferStatus = 'Pending Transfer';
        await vehicle.save();
        console.log('Vehicle status updated');

        // 5. Notify Buyer
        await Notification.create({
            userId: buyerEmail, // Notify Buyer
            type: 'info',
            title: 'Incoming Transfer Request',
            message: `${req.user.name || 'A Seller'} has initiated a transfer of vehicle ${vehicle.regNumber} to you. Please accept to proceed.`,
            relatedId: newRequest._id,
            relatedType: 'vehicle',
            actionUrl: '/dashboard/transfer-requests'
        });

        res.status(201).json({ message: 'Transfer request initiated successfully.', request: newRequest });

    } catch (error) {
        console.error('CRITICAL ERROR in /initiate:', error);
        console.error('Stack:', error.stack);

        let errorMessage = 'Failed to initiate transfer request.';
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({
            message: errorMessage,
            error: error.toString()
        });
    }
});

// Get my requests (as seller or buyer)
router.get('/my-requests', auth, async (req, res) => {
    try {
        const requests = await TransferRequest.find({
            $or: [
                { sellerId: req.user.id },
                { buyerEmail: req.user.email } // Assuming buyer checks via email if they don't have an ID yet
            ]
        })
            .populate('vehicleId', 'regNumber makeModel vehicleImage')
            .populate('sellerId', 'fullName email phone')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({ message: 'Failed to fetch transfer requests.' });
    }
});

// Buyer responds to transfer request (Accept/Reject)
router.put('/:id/respond', auth, async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const requestId = req.params.id;

        const request = await TransferRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Verify logged in user is the buyer
        if (request.buyerEmail !== req.user.email) {
            return res.status(403).json({ message: 'You are not valid buyer for this request.' });
        }

        // Need seller info for notification
        const seller = await User.findById(request.sellerId);

        if (action === 'approve') {
            request.buyerApprovalStatus = 'approved';
            await request.save();

            // Notify Seller
            if (seller) {
                await Notification.create({
                    userId: seller.email,
                    type: 'success',
                    title: 'Transfer Accepted by Buyer',
                    message: `Buyer ${req.user.name || request.buyerName} has accepted the transfer for vehicle. It is now pending Admin approval.`,
                    relatedId: request._id,
                    relatedType: 'vehicle',
                    actionUrl: '/dashboard/transfer-requests'
                });
            }

            res.json({ message: 'You have accepted the transfer request.', request });
        } else if (action === 'reject') {
            request.buyerApprovalStatus = 'rejected';
            request.status = 'rejected';
            request.rejectionReason = 'Rejected by Buyer';
            await request.save();

            // Revert vehicle status
            const vehicle = await Vehicle.findById(request.vehicleId);
            if (vehicle) {
                vehicle.transferStatus = 'None';
                await vehicle.save();
            }

            // Notify Seller
            if (seller) {
                await Notification.create({
                    userId: seller.email,
                    type: 'warning',
                    title: 'Transfer Rejected by Buyer',
                    message: `Buyer ${req.user.name || request.buyerName} has REJECTED the transfer request.`,
                    relatedId: request._id,
                    relatedType: 'vehicle',
                    actionUrl: '/dashboard/transfer-requests'
                });
            }

            res.json({ message: 'You have rejected the transfer request.', request });
        } else {
            return res.status(400).json({ message: 'Invalid action.' });
        }

    } catch (error) {
        console.error('Buyer response error:', error);
        res.status(500).json({ message: 'Failed to process response.' });
    }
});

module.exports = router;
