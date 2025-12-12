const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Vehicle = require('../models/Vehicle');

// Submit new application
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
      documents
    } = req.body;

    // Validation
    if (!ownerEmail || !ownerName || !nationalIdNo || !dateOfBirth || !permanentAddress || !phoneNumber || !emailAddress) {
      return res.status(400).json({ message: 'All owner information fields are required' });
    }

    if (!registrationNumber || !vehicleClass || !makeOfVehicle || !modelOfVehicle || !yearOfManufacture || !engineNumber || !chassisNumber || !colorOfVehicle || !fuelType || !noOfOwners) {
      return res.status(400).json({ message: 'All vehicle information fields are required' });
    }

    if (!documents || !documents.nidCopy || !documents.invoiceProof || !documents.insuranceDocument || !documents.emissionTest) {
      return res.status(400).json({ message: 'All required documents must be uploaded' });
    }

    // Check if application with same registration number already exists
    const existingApplication = await Application.findOne({ registrationNumber });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application with this registration number already exists' });
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
      registrationNumber,
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
      documents,
      status: 'Pending'
    });

    await newApplication.save();

    res.status(201).json({ 
      message: 'Application submitted successfully. You will receive updates via email.', 
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
    const applications = await Application.find({ ownerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get all applications (admin)
router.get('/all', async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
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

    // If approved, create a vehicle from the application
    if (status === 'Approved' && application.status !== 'Approved') {
      const newVehicle = new Vehicle({
        ownerEmail: application.ownerEmail,
        fullName: application.ownerName,
        nid: application.nationalIdNo,
        phone: application.phoneNumber,
        email: application.emailAddress,
        address: application.permanentAddress,
        regNumber: application.registrationNumber,
        vehicleType: application.vehicleClass,
        chassisNumber: application.chassisNumber,
        engineNumber: application.engineNumber,
        makeModel: `${application.makeOfVehicle} ${application.modelOfVehicle}`,
        fuelType: application.fuelType,
        year: application.yearOfManufacture,
        owners: application.noOfOwners,
        ownershipType: 'Personal',
        documents: application.documents,
        status: 'Approved',
        transferStatus: 'None'
      });

      await newVehicle.save();
    }

    // Update application
    application.status = status;
    application.adminNotes = adminNotes || application.adminNotes;
    application.reviewedBy = reviewedBy;
    application.reviewedAt = new Date();

    await application.save();

    res.status(200).json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error while updating application' });
  }
});

module.exports = router;
