const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get activities for a classroom
router.get('/classroom/:classCode', auth, async (req, res) => {
  try {
    const { classCode } = req.params;
    const activities = await Activity.find({ classCode })
      .sort({ date: -1 })
      .populate('createdBy', 'name');
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new activity
router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, date, tasks, classCode } = req.body;

    // Validate required fields
    if (!title || !description || !date || !classCode) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const newActivity = new Activity({
      title,
      description,
      date,
      tasks: tasks || [],
      classCode,
      createdBy: req.user.id
    });

    const savedActivity = await newActivity.save();
    
    // Emit the new activity to connected clients in the classroom
    req.app.get('io').to(classCode).emit('new_activity', savedActivity);
    
    res.json(savedActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Failed to create activity' });
  }
});

// Get activity by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('createdBy', 'name');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 