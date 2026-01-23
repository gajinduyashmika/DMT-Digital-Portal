const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog');

// Sri Lankan vehicle registration number prefixes by vehicle type
const VEHICLE_PREFIXES = {
  'Motorcycle': 'ABC',
  'Auto Rickshaw': 'AAA',
  'Car': 'CBS',
  'Van': 'CAA',
  'Bus': 'NB',
  'Truck': 'LE',
  'Lorry': 'LM',
  'Tractor': 'TRA',
};

// Get current ongoing vehicle number prefix
router.get('/current-ongoing-number', async (req, res) => {
  try {
    const { vehicleClass } = req.query;

    // Get the prefix for the vehicle class, default to CBS for cars
    const currentOngoingNumber = vehicleClass ? (VEHICLE_PREFIXES[vehicleClass] || 'CBS') : 'CBS';

    res.status(200).json({
      currentOngoingNumber,
      allPrefixes: VEHICLE_PREFIXES
    });
  } catch (error) {
    console.error('Error fetching current ongoing number:', error);
    res.status(500).json({ message: 'Server error while fetching current ongoing number' });
  }
});

// Register a new vehicle
router.post('/register', async (req, res) => {
  try {
    const {
      ownerEmail,
      fullName,
      nid,
      phone,
      email,
      address,
      regNumber,
      vehicleType,
      chassisNumber,
      engineNumber,
      makeModel,
      fuelType,
      year,
      owners,
      ownershipType,
      documents
    } = req.body;

    // Validation
    if (!ownerEmail || !fullName || !nid || !phone || !email || !address) {
      return res.status(400).json({ message: 'All owner information fields are required' });
    }

    if (!regNumber || !vehicleType || !chassisNumber || !engineNumber || !makeModel || !fuelType || !year || !owners || !ownershipType) {
      return res.status(400).json({ message: 'All vehicle information fields are required' });
    }

    if (!documents || !documents.nid || !documents.invoice || !documents.insurance || !documents.emission) {
      return res.status(400).json({ message: 'All required documents must be uploaded' });
    }

    // Check if vehicle with registration number already exists
    const existingVehicle = await Vehicle.findOne({ regNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      return res.status(400).json({ message: `Year must be between 1900 and ${currentYear + 1}` });
    }

    // Validate owners count
    if (owners < 1) {
      return res.status(400).json({ message: 'Number of owners must be at least 1' });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate NID format (Sri Lankan NIC: 9 digits + V or 12 digits)
    const nidRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nidRegex.test(nid.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid NID format. Must be 9 digits followed by V or 12 digits' });
    }

    // Create new vehicle
    const newVehicle = new Vehicle({
      ownerEmail,
      fullName,
      nid,
      phone,
      email,
      address,
      regNumber,
      vehicleType,
      chassisNumber,
      engineNumber,
      makeModel,
      fuelType,
      year: parseInt(year),
      owners: parseInt(owners),
      ownershipType,
      documents,
      status: 'Pending',
      transferStatus: 'None'
    });

    await newVehicle.save();

    res.status(201).json({
      message: 'Vehicle registered successfully',
      vehicle: newVehicle
    });

  } catch (error) {
    console.error('Error registering vehicle:', error);
    res.status(500).json({ message: 'Server error while registering vehicle' });
  }
});

// Get all vehicles
router.get('/all', async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .select('-documents -vehicleImage')
      .sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
});

// Get vehicles by owner email
router.get('/owner/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`Fetching vehicles for owner: ${email}`);
    // Case-insensitive search
    const vehicles = await Vehicle.find({
      $or: [
        { ownerEmail: { $regex: new RegExp(`^${email}$`, 'i') } },
        { 'previousOwners.email': { $regex: new RegExp(`^${email}$`, 'i') } }
      ]
    }).select('-documents -vehicleImage').sort({ createdAt: -1 });

    console.log(`Found ${vehicles.length} vehicles for ${email}`);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
});

// Get single vehicle by ID (metadata only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id).select('-documents -vehicleImage');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(500).json({ message: 'Server error while fetching vehicle' });
  }
});

// Get vehicle resources (documents and images)
router.get('/:id/resources', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id).select('documents vehicleImage');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle resources:', error);
    res.status(500).json({ message: 'Server error while fetching vehicle resources' });
  }
});

// Get vehicle by registration number (keep existing logic but maybe move it after ID route to avoid ID conflicts if any, though ID format differs usually)
router.get('/reg/:regNumber', async (req, res) => {
  try {
    const { regNumber } = req.params;
    const vehicle = await Vehicle.findOne({ regNumber });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Server error while fetching vehicle' });
  }
});

// Check if a registration number (VIP desired number) is available
router.get('/check-number/:number', async (req, res) => {
  try {
    const { number } = req.params;

    // Check existing vehicles
    const existsInVehicles = await Vehicle.findOne({ regNumber: number });

    // Check applications where either already assigned registrationNumber equals desired
    // or the desired VIP number is requested by someone else and application is not rejected
    const existingApp = await Application.findOne({
      $or: [
        { registrationNumber: number },
        { vipNumber: number, vipRequested: true, status: { $ne: 'Rejected' } }
      ]
    });

    const available = !existsInVehicles && !existingApp;

    res.status(200).json({
      number,
      available,
      takenBy: available ? null : (existsInVehicles ? 'vehicle' : 'application')
    });
  } catch (error) {
    console.error('Error checking number availability:', error);
    res.status(500).json({ message: 'Server error while checking number' });
  }
});

// Update vehicle status
router.put('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Under Review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle status updated', vehicle });
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

// Delete vehicle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Server error while deleting vehicle' });
  }
});

// Public search with audit logging and restricted data
router.post('/public-search', async (req, res) => {
  try {
    const { regNumber, requesterNIC, requesterPhone } = req.body;

    if (!regNumber || !requesterNIC || !requesterPhone) {
      return res.status(400).json({ message: 'Registration number, NIC, and Phone number are required' });
    }

    // Case-insensitive search for vehicle
    const vehicle = await Vehicle.findOne({
      regNumber: { $regex: new RegExp(`^${regNumber}$`, 'i') },
      $or: [{ status: 'Approved' }, { status: 'Active' }]
    }).select('-chassisNumber -engineNumber -documents -owners -__v'); // Exclude sensitive fields

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Log the search
    await AuditLog.create({
      action: 'VIEW',
      actorType: 'User',
      actorName: `Public User (${requesterNIC})`,
      actorEmail: requesterPhone, // Storing Phone as identifier
      role: 'Public',
      details: `Public user searched for vehicle: ${vehicle.regNumber}. Phone: ${requesterPhone}, NIC: ${requesterNIC}`,
      ipAddress: req.ip
    });

    res.json(vehicle);
  } catch (error) {
    console.error('Public search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});


// Public verification endpoint (Strictly limited data)
router.get('/verify/:regNumber', async (req, res) => {
  try {
    const { regNumber } = req.params;

    // Find vehicle by registration number
    const vehicle = await Vehicle.findOne({ regNumber });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // STRICT Data filtering - return ONLY what's safe for public verification
    // Intentionally constructing a new object rather than using .select() to be absolutely safe against schema changes
    const publicData = {
      regNumber: vehicle.regNumber,
      makeModel: vehicle.makeModel,
      vehicleType: vehicle.vehicleType,
      year: vehicle.year,
      color: vehicle.color || 'N/A', // Assuming color might be added later or exists in makeModel string sometimes
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      // We can infer validity from status
      isValid: vehicle.status === 'Approved' || vehicle.status === 'Active',
      lastUpdated: vehicle.updatedAt || vehicle.createdAt
    };

    res.status(200).json(publicData);
  } catch (error) {
    console.error('Error verifying vehicle:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;
