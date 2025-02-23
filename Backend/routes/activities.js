const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get activities for a classroom
router.get('/classroom/:classCode', auth, async (req, res) => {
  try {
    const { classCode } = req.params;
    
    // Get today's date at midnight for proper comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await Activity.find({ 
      classCode,
      // Add date filter to only get today's activities and future activities
      date: {
        $gte: today
      }
    })
    .sort({ date: 1 }) // Sort by date ascending
    .populate('createdBy', 'name')
    .lean(); // Convert to plain JavaScript object

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

    // Create activity with proper date handling
    const activityDate = new Date(date);
    activityDate.setHours(0, 0, 0, 0);

    const newActivity = new Activity({
      title,
      description,
      date: activityDate,
      tasks: tasks || [],
      classCode,
      createdBy: req.user.id
    });

    const savedActivity = await newActivity.save();
    
    // Populate createdBy before emitting
    const populatedActivity = await Activity.findById(savedActivity._id)
      .populate('createdBy', 'name');
    
    // Emit the new activity to connected clients in the classroom
    req.app.get('io').to(classCode).emit('new_activity', populatedActivity);
    
    res.json(populatedActivity);
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

// Add this new route for deleting an activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Delete the activity
    await Activity.findByIdAndDelete(req.params.id);

    // Emit activity deletion event to all clients in the classroom
    req.app.get('io').to(activity.classCode).emit('activity_deleted', activity._id);

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Modify the completion endpoint
router.post('/:activityId/complete', auth, async (req, res) => {
  try {
    const { activityId } = req.params;
    const { description } = req.body;
    const parentId = req.user.id;
    const parentName = req.user.name;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Get current total points for this parent
    let currentPoints = activity.totalParentPoints.get(parentId.toString()) || 0;
    // Add 5 more points
    const newPoints = currentPoints + 5;

    // Update total points for this parent
    activity.totalParentPoints.set(parentId.toString(), newPoints);

    // Add completion record
    activity.completions.push({
      parentId,
      parentName,
      description,
      classCode: activity.classCode,
      completedAt: new Date(),
      points: newPoints // Store cumulative points
    });

    await activity.save();

    // Emit socket event to notify about completion
    req.app.get('io').to(activity.classCode).emit('activity_completed', {
      activityId,
      parentName,
      classCode: activity.classCode,
      points: newPoints
    });

    res.json({ 
      success: true, 
      message: 'Activity marked as complete',
      completedAt: new Date(),
      points: newPoints
    });

  } catch (error) {
    console.error('Error completing activity:', error);
    res.status(500).json({ message: 'Error marking activity as complete' });
  }
});

module.exports = router; 