const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');

// Create a new announcement
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, classCode } = req.body;

    // Validate input
    if (!title || !description || !classCode) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create new announcement
    const announcement = new Announcement({
      title,
      description,
      classCode,
      createdBy: req.user.id
    });

    const savedAnnouncement = await announcement.save();
    
    // Emit socket event
    req.app.get('io').to(classCode).emit('new_announcement', savedAnnouncement);
    
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error while creating announcement' });
  }
});

// Get announcements by class code
router.get('/classroom/:classCode', auth, async (req, res) => {
  try {
    const { classCode } = req.params;
    
    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const announcements = await Announcement.find({ 
      classCode,
      createdAt: { $gte: twentyFourHoursAgo } // Only get announcements from last 24 hours
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error while fetching announcements' });
  }
});

module.exports = router;
