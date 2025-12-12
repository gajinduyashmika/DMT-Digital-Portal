const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Increase payload limit for base64 encoded documents (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

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

// Application routes
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

// Vehicle Makes routes
const vehicleMakesRoutes = require('./routes/vehiclemakes');
app.use('/api/vehicle-makes', vehicleMakesRoutes);
