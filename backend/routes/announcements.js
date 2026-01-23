const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();

// Get active announcements for users
router.get('/', async (req, res) => {
  try {
    const { target } = req.query;

    // Get only active announcements that haven't expired
    const query = {
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    // Filter by target if specified
    if (target && target !== 'all') {
      query.target = { $in: ['all', target] };
    }

    const announcements = await Announcement.find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(20)
      .select('title content type priority createdAt createdByName isPinned');

    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

// Get single announcement
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .select('title content type priority createdAt createdByName');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Failed to fetch announcement' });
  }
});

module.exports = router;
