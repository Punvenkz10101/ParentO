const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');
const auth = require('../middleware/auth');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

// Create a new classroom (Teacher only)
router.post('/teacher/classroom', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Validate classroom name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Classroom name is required' });
    }

    // Generate a unique class code
    let classCode = '';
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 5) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      classCode = '';
      for (let i = 0; i < 6; i++) {
        classCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      const existingClassroom = await Classroom.findOne({ classCode });
      if (!existingClassroom) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Unable to generate unique class code. Please try again.' });
    }

    // Create new classroom
    const classroom = new Classroom({
      name: name.trim(),
      classCode,
      teacher: req.user.id,
      students: []
    });

    // Save to database
    await classroom.save();
    
    // Return the created classroom
    res.status(201).json({
      _id: classroom._id,
      name: classroom.name,
      classCode: classroom.classCode,
      teacher: req.user.id,
      students: []
    });

  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Server error while creating classroom' });
  }
});

// Get teacher's classrooms
router.get('/teacher/classrooms', auth, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ teacher: req.user.id })
      .sort({ createdAt: -1 });
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Server error while fetching classrooms' });
  }
});

// Join classroom (Parent only)
router.post('/parent/join-classroom', auth, async (req, res) => {
  try {
    const { classCode } = req.body;
    
    if (!classCode || classCode.trim().length === 0) {
      return res.status(400).json({ message: 'Class code is required' });
    }

    // Find classroom by class code
    const classroom = await Classroom.findOne({ classCode: classCode.trim() });
    if (!classroom) {
      return res.status(404).json({ message: 'Invalid class code. Please check and try again.' });
    }

    // Check if parent already joined
    if (classroom.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already joined this classroom' });
    }

    // Add parent to classroom
    classroom.students.push(req.user.id);
    await classroom.save();

    res.json(classroom);
  } catch (error) {
    console.error('Error joining classroom:', error);
    res.status(500).json({ message: 'Server error while joining classroom' });
  }
});

// Get parent's classrooms
router.get('/parent/classrooms', auth, async (req, res) => {
  try {
    const classrooms = await Classroom.find({ students: req.user.id })
      .sort({ createdAt: -1 });
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Server error while fetching classrooms' });
  }
});

module.exports = router;
