const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const { initializeRunningNumbers } = require('./utils/numberGenerator');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Increase payload limit for base64 encoded documents (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB with fallback
async function connectWithFallback() {
  const primary = process.env.MONGO_URI;
  const fallback = process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017/dmtdigitalportal';

  try {
    await mongoose.connect(primary);
    console.log('MongoDB connected (primary URI)');
    initializeRunningNumbers(); // Seed numbers
  } catch (err) {
    console.error('Primary MongoDB connection failed:', err.message);
    console.log('Attempting fallback MongoDB connection...');
    try {
      await mongoose.connect(fallback);
      console.log('MongoDB connected (fallback URI)');
      initializeRunningNumbers(); // Seed numbers
    } catch (err2) {
      console.error('Fallback MongoDB connection failed:', err2.message);
      throw err2;
    }
  }

  // Ensure no unique index on Application.registrationNumber to allow multiple nulls
  try {
    const conn = mongoose.connection;
    const coll = conn.db.collection('applications');
    await coll.dropIndex('registrationNumber_1');
    console.log('Dropped index registrationNumber_1 on applications');
  } catch (e) {
    if (e && e.codeName !== 'IndexNotFound') {
      console.warn('Dropping registrationNumber_1 index skipped:', e.message);
    }
  }
}

connectWithFallback().catch(err => {
  console.error('Database connection error:', err);
});

// Simple route
app.get('/', (req, res) => {
  res.send('DMT Digital Portal Backend is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use('/api/auth', authRoutes);

// Vehicle routes
const vehicleRoutes = require('./routes/vehicles');
app.use('/api/vehicles', vehicleRoutes);

// Transfer routes
const transferRoutes = require('./routes/transfers');
app.use('/api/transfers', transferRoutes);

// Application routes
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

// Notification routes
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Public Announcements routes
const announcementsRoutes = require('./routes/announcements');
app.use('/api/announcements', announcementsRoutes);

// Image Verification routes
const imageVerificationRoutes = require('./routes/imageVerification');
app.use('/api/image-verification', imageVerificationRoutes);

// AI Bot routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Ticket routes
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

// Vehicle Makes routes
const vehicleMakesRoutes = require('./routes/vehiclemakes');
app.use('/api/vehicle-makes', vehicleMakesRoutes);

// =====================
// ADMIN ROUTES
// =====================

// Admin Authentication routes
const adminAuthRoutes = require('./routes/adminAuth');
app.use('/api/admin/auth', adminAuthRoutes);

// Admin Management routes (applications, users, stats)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Admin Tickets routes
const adminTicketsRoutes = require('./routes/adminTickets');
app.use('/api/admin/tickets', adminTicketsRoutes);

// Admin Staff Management routes
const adminStaffRoutes = require('./routes/adminStaff');
app.use('/api/admin/staff', adminStaffRoutes);

// Admin Announcements routes
const adminAnnouncementsRoutes = require('./routes/adminAnnouncements');
app.use('/api/admin/announcements', adminAnnouncementsRoutes);

// Admin System Settings routes
const adminSettingsRoutes = require('./routes/adminSettings');
app.use('/api/admin/settings', adminSettingsRoutes);

// Admin Notifications routes (broadcast notifications)
const adminNotificationsRoutes = require('./routes/adminNotifications');
app.use('/api/admin/notifications', adminNotificationsRoutes);

// DB health route
app.get('/api/health/db', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.json({ state });
});
