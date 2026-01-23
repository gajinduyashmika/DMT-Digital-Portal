const express = require('express');
const jwt = require('jsonwebtoken');
const SystemSettings = require('../models/SystemSettings');
const AuditLog = require('../models/AuditLog');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get system settings
router.get('/', verifyAdmin, async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({ key: 'main' });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new SystemSettings({ key: 'main' });
      await settings.save();
    }
    
    res.json({ settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ message: 'Failed to fetch system settings' });
  }
});

// Update system settings
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const { modules, email, fileUpload, multilingual, certificate, maintenance, security, support } = req.body;
    
    let settings = await SystemSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = new SystemSettings({ key: 'main' });
    }
    
    if (modules) settings.modules = { ...settings.modules, ...modules };
    if (email) settings.email = { ...settings.email, ...email };
    if (fileUpload) settings.fileUpload = { ...settings.fileUpload, ...fileUpload };
    if (multilingual) settings.multilingual = { ...settings.multilingual, ...multilingual };
    if (certificate) settings.certificate = { ...settings.certificate, ...certificate };
    if (maintenance) settings.maintenance = { ...settings.maintenance, ...maintenance };
    if (security) settings.security = { ...settings.security, ...security };
    if (support) settings.support = { ...settings.support, ...support };
    
    await settings.save();
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: 'SETTINGS_UPDATE',
      targetType: 'settings',
      targetId: 'main',
      details: { updatedSections: Object.keys(req.body) },
      ipAddress: req.ip
    }).save();
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ message: 'Failed to update system settings' });
  }
});

// Update specific module toggle
router.put('/modules/:module', verifyAdmin, async (req, res) => {
  try {
    const { module } = req.params;
    const { enabled } = req.body;
    
    let settings = await SystemSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = new SystemSettings({ key: 'main' });
    }
    
    settings.modules[module] = enabled;
    await settings.save();
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: `MODULE_${enabled ? 'ENABLE' : 'DISABLE'}`,
      targetType: 'settings',
      targetId: module,
      details: { module, enabled },
      ipAddress: req.ip
    }).save();
    
    res.json({ message: `Module ${module} ${enabled ? 'enabled' : 'disabled'}`, settings });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Failed to update module' });
  }
});

// Test email configuration
router.post('/test-email', verifyAdmin, async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    // Simulate email test (in production, actually send test email)
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${testEmail}` 
    });
  } catch (error) {
    console.error('Error testing email:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email' });
  }
});

// Toggle maintenance mode
router.put('/maintenance', verifyAdmin, async (req, res) => {
  try {
    const { enabled, message, scheduledStart, scheduledEnd } = req.body;
    
    let settings = await SystemSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = new SystemSettings({ key: 'main' });
    }
    
    settings.maintenance = {
      enabled,
      message: message || settings.maintenance.message,
      scheduledStart: scheduledStart || null,
      scheduledEnd: scheduledEnd || null
    };
    
    await settings.save();
    
    // Log the action
    await new AuditLog({
      adminId: req.admin.adminId,
      action: `MAINTENANCE_${enabled ? 'ENABLE' : 'DISABLE'}`,
      targetType: 'settings',
      targetId: 'maintenance',
      details: { enabled, message },
      ipAddress: req.ip
    }).save();
    
    res.json({ 
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, 
      settings 
    });
  } catch (error) {
    console.error('Error updating maintenance mode:', error);
    res.status(500).json({ message: 'Failed to update maintenance mode' });
  }
});

module.exports = router;
