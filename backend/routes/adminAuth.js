const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact system administrator.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create audit log
    await AuditLog.create({
      adminId: admin._id,
      adminEmail: admin.email,
      adminName: admin.name,
      action: 'LOGIN',
      targetType: 'system',
      ipAddress: req.ip,
    });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        department: admin.department,
        profilePicture: admin.profilePicture,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Create initial super admin (seed)
router.post('/seed', async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@dmt.gov.lk' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const superAdmin = new Admin({
      email: 'admin@dmt.gov.lk',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'super_admin',
      department: 'IT Department',
      nic: '123456789V',
      isActive: true,
    });

    await superAdmin.save();

    res.status(201).json({ message: 'Super admin created successfully', email: 'admin@dmt.gov.lk', password: 'admin123' });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (just for audit log)
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = await Admin.findById(decoded.id);
      
      if (admin) {
        await AuditLog.create({
          adminId: admin._id,
          adminEmail: admin.email,
          adminName: admin.name,
          action: 'LOGOUT',
          targetType: 'system',
          ipAddress: req.ip,
        });
      }
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.json({ message: 'Logged out' });
  }
});

module.exports = router;
