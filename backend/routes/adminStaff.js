const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware to verify super admin
const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'super_admin') {
      return res.status(403).json({ message: 'Super admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all staff members
router.get('/', verifySuperAdmin, async (req, res) => {
  try {
    const { role, search, isActive } = req.query;

    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { nic: { $regex: search, $options: 'i' } },
      ];
    }

    const staff = await Admin.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Failed to fetch staff' });
  }
});

// Get single staff member
router.get('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const staff = await Admin.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Failed to fetch staff member' });
  }
});

// Create new staff member
router.post('/', verifySuperAdmin, async (req, res) => {
  try {
    const { email, password, name, role, department, nic } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name,
      role,
      department: department || 'General',
      nic,
      isActive: true,
    });

    await newAdmin.save();

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'STAFF_CREATED',
      targetType: 'staff',
      targetId: newAdmin._id.toString(),
      details: { email, name, role },
    });

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: {
        id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        department: newAdmin.department,
      },
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ message: 'Failed to create staff member' });
  }
});

// Update staff member
router.put('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { name, role, department, nic, isActive } = req.body;

    const staff = await Admin.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Don't allow modifying super_admin role
    if (staff.role === 'super_admin' && role !== 'super_admin') {
      return res.status(403).json({ message: 'Cannot change super admin role' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (role) updates.role = role;
    if (department) updates.department = department;
    if (nic) updates.nic = nic;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedStaff = await Admin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'STAFF_UPDATED',
      targetType: 'staff',
      targetId: staff._id.toString(),
      details: updates,
    });

    res.json({ message: 'Staff member updated', staff: updatedStaff });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ message: 'Failed to update staff member' });
  }
});

// Reset staff password
router.put('/:id/reset-password', verifySuperAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const staff = await Admin.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Delete staff member
router.delete('/:id', verifySuperAdmin, async (req, res) => {
  try {
    const staff = await Admin.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (staff.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }

    await Admin.findByIdAndDelete(req.params.id);

    // Audit log
    await AuditLog.create({
      adminId: req.admin.id,
      adminEmail: req.admin.email,
      adminName: req.admin.name || req.admin.email,
      action: 'STAFF_DELETED',
      targetType: 'staff',
      targetId: staff._id.toString(),
      details: { email: staff.email, name: staff.name },
    });

    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ message: 'Failed to delete staff member' });
  }
});

module.exports = router;
