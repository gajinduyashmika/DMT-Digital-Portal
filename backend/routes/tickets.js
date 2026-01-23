const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Create a new ticket
router.post('/create', async (req, res) => {
  try {
    const { userEmail, userName, title, description, category, priority } = req.body;

    if (!userEmail || !userName || !title || !description) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newTicket = new Ticket({
      userEmail,
      userName,
      title,
      description,
      category: category || 'General',
      priority: priority || 'Medium',
      status: 'Open',
      messages: [
        {
          senderEmail: userEmail,
          senderName: userName,
          isAdmin: false,
          message: description,
          timestamp: new Date(),
        },
      ],
    });

    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Failed to create ticket' });
  }
});

// Get all tickets for a user
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const tickets = await Ticket.find({ userEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// Get single ticket by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Failed to fetch ticket' });
  }
});

// Configure Multer for attachments
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/attachments');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'attachment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Add message to ticket (with optional attachments)
router.post('/:id/message', (req, res, next) => {
  upload.array('attachments', 3)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(500).json({ message: "File upload error", error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error("Unknown Upload Error:", err);
      return res.status(500).json({ message: "Unknown upload error", error: err.message });
    }
    // Everything went fine.
    next();
  });
}, async (req, res) => {
  console.log(`[Tickets] Received message request for ID: ${req.params.id}`);
  try {
    const { id } = req.params;
    const { senderEmail, senderName, message, isAdmin } = req.body;
    console.log(`[Tickets] Body:`, req.body);
    console.log(`[Tickets] Files:`, req.files);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Ticket ID format' });
    }

    // Process uploaded files
    const attachments = req.files ? req.files.map(file => ({
      url: `/uploads/attachments/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 'document',
      name: file.originalname
    })) : [];

    if (!message && attachments.length === 0) {
      return res.status(400).json({ message: 'Message or attachment is required' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            senderEmail,
            senderName,
            isAdmin: String(isAdmin) === 'true', // Handle FormData string conversion
            message: message || '',
            attachments,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Message added successfully', ticket });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Failed to add message', error: error.message });
  }
});

// Update ticket status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Close ticket
router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(id, { status: 'Closed' }, { new: true });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket closed', ticket });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({ message: 'Failed to close ticket' });
  }
});

module.exports = router;
