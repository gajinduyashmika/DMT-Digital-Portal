const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Vehicle = require('../models/Vehicle');
const AuditLog = require('../models/AuditLog');
const RunningNumber = require('../models/RunningNumber'); // Import RunningNumber
const { createNotification } = require('./notifications');
const { generateNextNumber, getOngoingNumbers } = require('../utils/numberGenerator');

// Sri Lankan vehicle registration number prefixes by vehicle type
const VEHICLE_PREFIXES = {
  'Motorcycle': 'ABC', // Motorcycles use 3-letter combinations
  'Auto Rickshaw': 'AAA', // Three-wheelers
  'Car': 'CBS', // Private cars use 3-letter combinations
  'Van': 'CAA', // Vans
  'Bus': 'NB', // Buses use NB, NC, ND prefixes (2 letters)
  'Truck': 'LE', // Lorries/Trucks use LE, LF, LG (2 letters)
  'Lorry': 'LM', // Lorries (2 letters)
  'Tractor': 'TRA', // Tractors
};

// Get current ongoing number for vehicle type
function getCurrentOngoingNumber(vehicleClass) {
  return VEHICLE_PREFIXES[vehicleClass] || 'CBS';
}

// Get ongoing numbers for VIP validation
router.get('/ongoing-numbers', async (req, res) => {
  try {
    const numbers = await getOngoingNumbers();
    res.json(numbers);
  } catch (error) {
    console.error('Error fetching ongoing numbers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit new application
// Helper: fee by vehicle class
const CLASS_FEES = {
  Car: 5000,
  Motorcycle: 2000,
  ThreeWheel: 2500,
  Van: 4500,
  Bus: 7000,
  Lorry: 6500,
  Tractor: 3000,
  Heavy: 9000,
  Default: 4000,
};

function calcFee(vehicleClass) {
  return CLASS_FEES[vehicleClass] || CLASS_FEES.Default;
}

function generateReference(ownerEmail) {
  const ts = Date.now().toString().slice(-8);
  const prefix = 'DMT';
  const hash = Buffer.from(ownerEmail).toString('hex').slice(0, 4).toUpperCase();
  return `${prefix}-${ts}-${hash}`;
}

// Helper: Calculate Special Number (VIP) fee based on letter increment and special digits
async function calculateSpecialFee(requestedNumber, vehicleClass) {
  if (!requestedNumber) return 0;

  // Extract letters from requested number (e.g., "CBT-1234" -> "CBT")
  const match = requestedNumber.match(/^([A-Z]+)/);
  if (!match) return 0;

  const requestedLetters = match[1];

  // Fetch current ongoing series for the vehicle class
  // Map vehicleClass to RunningNumber category (logic from numberGenerator.js)
  let dbCategory = 'Car';
  if (['Motorcycle', 'Motor Cycle'].includes(vehicleClass)) dbCategory = 'Motor Cycle';
  else if (['Auto Rickshaw', 'Three Wheeler'].includes(vehicleClass)) dbCategory = 'Three Wheeler';
  else if (['Van', 'Dual Purpose', 'Truck', 'Lorry'].includes(vehicleClass)) dbCategory = 'Dual Purpose';
  else if (['Lorry Trailer', 'Bowser', 'Heavy'].includes(vehicleClass)) dbCategory = 'Lorry Trailer/Bowser';

  const running = await RunningNumber.findOne({ category: dbCategory });
  const currentLetters = running ? running.series : (VEHICLE_PREFIXES[vehicleClass] || 'CBS');

  // Calculate letter increment cost (10,000 LKR per letter increment)
  let letterIncrementCost = 0;
  const currentValue = lettersToNumber(currentLetters);
  const requestedValue = lettersToNumber(requestedLetters);
  const letterDiff = requestedValue - currentValue;

  if (letterDiff > 0) {
    letterIncrementCost = letterDiff * 10000;
  }

  // Check for special digit patterns with different pricing
  const digitMatch = requestedNumber.match(/-?(\d{4})$/);
  let specialDigitCost = 0;

  if (digitMatch) {
    const digits = digitMatch[1];
    const d1 = parseInt(digits[0]);
    const d2 = parseInt(digits[1]);
    const d3 = parseInt(digits[2]);
    const d4 = parseInt(digits[3]);

    // 1. Same digits (0000, 1111, 2222, etc.) - Most expensive
    if (d1 === d2 && d2 === d3 && d3 === d4) {
      specialDigitCost = 400000; // 300,000 - 500,000 LKR
    }
    // 2. Sequential ascending (1234, 2345, 3456, etc.)
    else if (d2 === d1 + 1 && d3 === d2 + 1 && d4 === d3 + 1) {
      specialDigitCost = 275000; // 200,000 - 350,000 LKR
    }
    // 3. Sequential descending (4321, 5432, 6543, etc.)
    else if (d2 === d1 - 1 && d3 === d2 - 1 && d4 === d3 - 1) {
      specialDigitCost = 275000; // 200,000 - 350,000 LKR
    }
    // 4. Double pairs (1122, 2233, 3344, etc.)
    else if (d1 === d2 && d3 === d4 && d1 !== d3) {
      specialDigitCost = 200000; // 150,000 - 250,000 LKR
    }
    // 5. Palindromes (1221, 1331, 2112, etc.)
    else if (d1 === d4 && d2 === d3 && d1 !== d2) {
      specialDigitCost = 150000; // 100,000 - 200,000 LKR
    }
    // 6. Mirror pairs (1001, 2002, 3003, etc.)
    else if (d1 === d4 && d2 === 0 && d3 === 0) {
      specialDigitCost = 115000; // 80,000 - 150,000 LKR
    }
    // 7. Repeating pairs (1212, 2323, 3434, etc.)
    else if (d1 === d3 && d2 === d4 && d1 !== d2) {
      specialDigitCost = 75000; // 50,000 - 100,000 LKR
    }
    // 8. Three same digits (1112, 2223, 3334, etc.)
    else if ((d1 === d2 && d2 === d3) || (d2 === d3 && d3 === d4)) {
      specialDigitCost = 50000; // 30,000 - 70,000 LKR
    }
  }

  return letterIncrementCost + specialDigitCost;
}

// Helper: Convert letters to numeric value (A=1, B=2, ..., Z=26)
function lettersToNumber(letters) {
  let value = 0;
  for (let i = 0; i < letters.length; i++) {
    value = value * 26 + (letters.charCodeAt(i) - 64); // A=1, B=2, etc.
  }
  return value;
}

router.post('/submit', async (req, res) => {
  try {
    const {
      ownerEmail,
      ownerName,
      nationalIdNo,
      dateOfBirth,
      permanentAddress,
      phoneNumber,
      emailAddress,
      occupation,
      // registrationNumber is assigned later; accept optional
      registrationNumber,
      vehicleClass,
      makeOfVehicle,
      modelOfVehicle,
      yearOfManufacture,
      engineNumber,
      chassisNumber,
      colorOfVehicle,
      fuelType,
      engineCapacity,
      numberOfCylinders,
      importedOrLocal,
      emissionStandard,
      noOfOwners,
      vehicleImage, // Add vehicleImage
      documents
    } = req.body;

    // Validation
    if (!ownerEmail || !ownerName || !nationalIdNo || !dateOfBirth || !permanentAddress || !phoneNumber || !emailAddress) {
      return res.status(400).json({ message: 'All owner information fields are required' });
    }

    if (!vehicleClass || !makeOfVehicle || !modelOfVehicle || !yearOfManufacture || !engineNumber || !chassisNumber || !colorOfVehicle || !fuelType || !noOfOwners) {
      return res.status(400).json({ message: 'All vehicle information fields are required' });
    }

    if (!documents || !documents.nidCopy || !documents.invoiceProof || !documents.insuranceDocument || !documents.emissionTest) {
      return res.status(400).json({ message: 'All required documents must be uploaded' });
    }

    // If provided, ensure registration number isn't duplicated
    if (registrationNumber) {
      const existingApplication = await Application.findOne({ registrationNumber });
      if (existingApplication) {
        return res.status(400).json({ message: 'Application with this registration number already exists' });
      }
    }

    // Validate NID format (Sri Lankan NIC: 9 digits + V or 12 digits)
    const nidRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nidRegex.test(nationalIdNo.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid NID format' });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (yearOfManufacture < 1900 || yearOfManufacture > currentYear + 1) {
      return res.status(400).json({ message: `Year must be between 1900 and ${currentYear + 1}` });
    }

    // Payment data
    const baseAmount = calcFee(vehicleClass);
    const vipRequested = !!req.body.vipRequested;
    const vipNumber = req.body.vipNumber || null;

    // Calculate Special Number Fee using dynamic DB value
    const vipFee = (vipRequested && vipNumber) ? await calculateSpecialFee(vipNumber, vehicleClass) : 0;

    const paymentAmount = baseAmount + vipFee;
    const paymentReference = generateReference(ownerEmail);

    // If Special number is requested, use it as the registration number
    const finalRegistrationNumber = (vipRequested && vipNumber) ? vipNumber : (registrationNumber || null);

    // Create new application
    const newApplication = new Application({
      ownerEmail,
      ownerName,
      nationalIdNo,
      dateOfBirth,
      permanentAddress,
      phoneNumber,
      emailAddress,
      occupation,
      registrationNumber: finalRegistrationNumber,
      vehicleClass,
      makeOfVehicle,
      modelOfVehicle,
      yearOfManufacture: parseInt(yearOfManufacture),
      engineNumber,
      chassisNumber,
      colorOfVehicle,
      fuelType,
      engineCapacity,
      numberOfCylinders: numberOfCylinders ? parseInt(numberOfCylinders) : 0,
      importedOrLocal,
      emissionStandard,
      noOfOwners: parseInt(noOfOwners),
      vehicleImage, // Save vehicleImage
      documents,
      status: 'Pending',
      paymentReference,
      paymentAmount,
      paymentStatus: 'Pending',
      vipRequested,
      vipNumber,
      vipFee
    });

    await newApplication.save();

    await createNotification(
      ownerEmail,
      'success',
      'Application Submitted Successfully',
      `Your vehicle registration application for ${makeOfVehicle} ${modelOfVehicle} has been submitted. Reference: ${paymentReference}`,
      newApplication._id,
      'application',
      `/application-status`
    );

    // Audit Log
    try {
      await AuditLog.create({
        actorType: 'User',
        userEmail: ownerEmail,
        action: 'APPLICATION_SUBMITTED',
        targetType: 'application',
        targetId: newApplication._id.toString(),
        details: {
          reference: paymentReference,
          vehicle: `${makeOfVehicle} ${modelOfVehicle}`
        },
        ipAddress: req.ip
      });
    } catch (logErr) { console.error('Audit log error', logErr); }

    res.status(201).json({
      message: 'Application submitted successfully. Please pay via Post Office using your reference number.',
      application: newApplication
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error while submitting application' });
  }
});

// Get all applications for a user
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await Application.find({ ownerEmail: email })
      .select('-documents -vehicleImage')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get all applications (admin)
router.get('/all', async (req, res) => {
  try {
    const applications = await Application.find()
      .select('-documents -vehicleImage')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get single application (metadata only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).select('-documents -vehicleImage');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
  }
});

// Get application resources (documents and images)
router.get('/:id/resources', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).select('documents vehicleImage');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application resources:', error);
    res.status(500).json({ message: 'Server error while fetching application resources' });
  }
});

// Update application status (admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, reviewedBy } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Under Review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Payment Check: Cannot approve if not paid
    if (status === 'Approved' && application.paymentStatus !== 'Paid') {
      return res.status(400).json({
        message: 'Cannot approve application. Payment has not been verified.',
        error: 'PAYMENT_PENDING'
      });
    }

    // If approved, assign registration number if needed and create a vehicle
    if (status === 'Approved' && application.status !== 'Approved') {
      // Assign registration number
      let regNumber = application.registrationNumber;
      if (!regNumber) {
        if (application.vipRequested && application.vipNumber) {
          regNumber = application.vipNumber;
        } else {
          // Generate sequential number based on class
          regNumber = await generateNextNumber(application.vehicleClass);
        }
        application.registrationNumber = regNumber;
      }

      const newVehicle = new Vehicle({
        ownerEmail: application.ownerEmail,
        fullName: application.ownerName,
        nid: application.nationalIdNo,
        phone: application.phoneNumber,
        email: application.emailAddress,
        address: application.permanentAddress,
        regNumber: regNumber,
        vehicleType: application.vehicleClass === 'Motorcycle' ? 'Bike' : (['Car', 'Van', 'Bus', 'Truck'].includes(application.vehicleClass) ? application.vehicleClass : 'Car'),
        chassisNumber: application.chassisNumber,
        engineNumber: application.engineNumber,
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
        status: 'Approved',
        transferStatus: 'None',
        vehicleImage: application.vehicleImage // Transfer vehicleImage to Vehicle record
      });

      await newVehicle.save();
    }

    // Update application
    application.status = status;
    application.adminNotes = adminNotes || application.adminNotes;
    application.reviewedBy = reviewedBy;
    application.reviewedAt = new Date();

    await application.save();

    // Create notification based on status change
    let notificationType = 'info';
    let notificationTitle = 'Application Status Updated';
    let notificationMessage = `Your application status has been updated to ${status}.`;

    if (status === 'Approved') {
      notificationType = 'success';
      notificationTitle = 'Application Approved!';
      const regNumber = application.registrationNumber || 'Pending';
      notificationMessage = `Congratulations! Your vehicle registration for ${application.makeOfVehicle} ${application.modelOfVehicle} has been approved. Registration Number: ${regNumber}`;
    } else if (status === 'Rejected') {
      notificationType = 'warning';
      notificationTitle = 'Application Rejected';
      notificationMessage = `Your vehicle registration application has been rejected. Please contact support for more information.`;
    } else if (status === 'Under Review') {
      notificationType = 'info';
      notificationTitle = 'Application Under Review';
      notificationMessage = `Your application is now under review. We will notify you once the review is complete.`;
    }

    await createNotification(
      application.ownerEmail,
      notificationType,
      notificationTitle,
      notificationMessage,
      id,
      'application',
      `/application-status`
    );

    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
});

// Mark Payment as Paid (Post Office/External API)
router.post('/payments/dmt/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    // Find application by payment reference
    const application = await Application.findOne({ paymentReference: reference });

    if (!application) {
      return res.status(404).json({ message: 'Invalid Payment Reference' });
    }

    if (application.paymentStatus === 'Paid') {
      return res.status(200).json({ message: 'Payment already received', application });
    }

    application.paymentStatus = 'Paid';
    application.paymentDate = new Date();
    await application.save();

    // Notify User
    await createNotification(
      application.ownerEmail,
      'success',
      'Payment Received',
      `Payment of LKR ${application.paymentAmount} received for reference ${reference}. Application is now ready for review.`,
      application._id,
      'application',
      `/application-status`
    );

    // Audit Log for Payment
    try {
      await AuditLog.create({
        actorType: 'System',
        userEmail: 'system@dmt.gov.lk',
        action: 'PAYMENT_RECEIVED',
        targetType: 'application',
        targetId: application._id.toString(),
        details: {
          reference: reference,
          amount: application.paymentAmount
        },
        ipAddress: req.ip
      });
    } catch (logErr) { console.error('Audit log error', logErr); }

    res.status(200).json({
      message: 'Payment marked as sucessful',
      application
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error processing payment' });
  }
});

// Delete an application (only for Pending status)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow deletion of pending applications
    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending applications can be deleted' });
    }

    const ownerEmail = application.ownerEmail;
    const vehicleInfo = `${application.makeOfVehicle} ${application.modelOfVehicle}`;

    await Application.findByIdAndDelete(id);

    // Create notification for application deletion
    await createNotification(
      ownerEmail,
      'info',
      'Application Deleted',
      `Your vehicle registration application for ${vehicleInfo} has been deleted.`,
      id,
      'application',
      null
    );

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ message: 'Server error while deleting application' });
  }
});

// Cancel an application (change status to Cancelled)
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow cancellation of pending applications
    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending applications can be cancelled' });
    }

    const ownerEmail = application.ownerEmail;
    const vehicleInfo = `${application.makeOfVehicle} ${application.modelOfVehicle}`;

    application.status = 'Cancelled';
    await application.save();

    // Create notification for application cancellation
    await createNotification(
      ownerEmail,
      'warning',
      'Application Cancelled',
      `Your vehicle registration application for ${vehicleInfo} has been cancelled.`,
      id,
      'application',
      `/application-status`
    );

    res.status(200).json({ message: 'Application cancelled successfully', application });
  } catch (error) {
    console.error('Error cancelling application:', error);
    res.status(500).json({ message: 'Server error while cancelling application' });
  }
});

// Update an application (only for Pending status)
router.put('/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only allow editing of pending applications
    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending applications can be edited' });
    }

    // Update allowed fields
    const allowedFields = [
      'ownerName', 'nationalIdNo', 'dateOfBirth', 'permanentAddress',
      'phoneNumber', 'emailAddress', 'occupation',
      'vehicleClass', 'makeOfVehicle', 'modelOfVehicle', 'yearOfManufacture',
      'engineNumber', 'chassisNumber', 'colorOfVehicle', 'fuelType',
      'engineCapacity', 'numberOfCylinders', 'importedOrLocal', 'emissionStandard',
      'noOfOwners', 'documents', 'vipRequested', 'vipNumber'
    ];

    for (const field of allowedFields) {
      if (field in updateData) {
        application[field] = updateData[field];
      }
    }

    await application.save();

    res.status(200).json({ message: 'Application updated successfully', application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
});

module.exports = router;
