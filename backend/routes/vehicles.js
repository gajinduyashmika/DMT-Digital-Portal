const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

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
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
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
    const vehicles = await Vehicle.find({ ownerEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Server error while fetching vehicles' });
  }
});

// Get vehicle by registration number
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

module.exports = router;
