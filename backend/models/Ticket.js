const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['General', 'Technical', 'Registration', 'Payment', 'Other'], default: 'General' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  messages: [
    {
      senderEmail: String,
      senderName: String,
      isAdmin: { type: Boolean, default: false },
      message: String,
      attachments: [
        {
          url: String,
          type: String, // 'image', 'document'
          name: String
        }
      ],
      timestamp: { type: Date, default: Date.now },
    },
  ],
  assignedTo: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
