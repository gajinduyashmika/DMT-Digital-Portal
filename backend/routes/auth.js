const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Add this
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'; // Make sure to add this in your .env

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, nationalId, address, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !nationalId || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      phone,
      nationalId,
      address,
      password: hashedPassword,
      profilePicture: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg', // Default profile picture URL
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Track Login History
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const cleanDevice = userAgent.includes('Mobile') ? 'Mobile Device' : (userAgent.includes('Windows') ? 'Windows PC' : 'Device');

    user.loginHistory.push({
      ip: req.ip || req.connection.remoteAddress,
      device: cleanDevice,
      date: new Date()
    });
    // Keep only last 10 entries
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, version: user.tokenVersion || 0 }, // Include version
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Audit Log
    try {
      await AuditLog.create({
        actorType: 'User',
        userId: user._id,
        userEmail: user.email,
        action: 'LOGIN',
        targetType: 'system',
        ipAddress: req.ip
      });
    } catch (logErr) {
      console.error('Audit log error', logErr);
    }

    res.json({ token, fullName: user.fullName, email: user.email, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/login-history/:email
router.get('/login-history/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('loginHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.loginHistory.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout-all
router.post('/logout-all', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    res.json({ message: 'Logged out from all devices successfully.' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Return the list of users
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/user/:email
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the user data (excluding sensitive fields like password)
    const { password, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/user/:email
router.put('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { fullName, phone, address, currentPassword, newPassword, profilePicture } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If updating password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to update password.' });
      }

      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    // Update profile fields
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Update profile picture (accepts base64 or URL)
    if (profilePicture) {
      // Validate that it's a valid base64 or URL
      if (profilePicture.startsWith('data:image/') || profilePicture.startsWith('http')) {
        user.profilePicture = profilePicture;
      } else {
        return res.status(400).json({ message: 'Invalid profile picture format.' });
      }
    }

    await user.save();

    // Return updated user data (excluding password)
    const { password, ...userData } = user.toObject();
    res.json({ message: 'User updated successfully', user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/verify-security
router.post('/verify-security', async (req, res) => {
  try {
    const { nic, password } = req.body;

    if (!nic || !password) {
      return res.status(400).json({ success: false, message: 'NIC and password are required.' });
    }

    // Find user by NIC
    const user = await User.findOne({ nationalId: nic });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    // specific check for blocked status
    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Account is blocked.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    res.json({ success: true, message: 'Verification successful.' });
  } catch (error) {
    console.error('Security verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification.' });
  }
});

module.exports = router;
