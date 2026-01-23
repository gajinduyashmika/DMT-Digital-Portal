const mongoose = require('mongoose');

const runningNumberSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    series: {
        type: String, // e.g., 'CBU', 'PK'
        required: true
    },
    lastNumber: {
        type: Number, // e.g., 3919
        required: true
    },
    lastIssued: {
        type: String, // e.g., 'CBU-3919', redundancy for easy reading
    }
}, { timestamps: true });

module.exports = mongoose.model('RunningNumber', runningNumberSchema);
