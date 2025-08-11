const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // parse JSON body

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
