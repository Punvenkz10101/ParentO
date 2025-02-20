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
    const teacherId = req.user.id;

    // Check if teacher already has a classroom
    const existingClassroom = await Classroom.findOne({ teacher: teacherId });
    if (existingClassroom) {
      return res.status(400).json({ message: 'You can only create one classroom' });
    }

    // Get teacher details
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Validate classroom name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Classroom name is required' });
    }

<<<<<<< HEAD
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
      
      const existingClassroomWithCode = await Classroom.findOne({ classCode });
      if (!existingClassroomWithCode) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Unable to generate unique class code. Please try again.' });
=======
    // Generate a unique class code using the model's static method
    let classCode;
    try {
      classCode = await Classroom.generateClassCode();
    } catch (error) {
      return res.status(500).json({ message: error.message });
>>>>>>> 855b10f55226d2add25be55afa78c341e121c792
    }

    // Create new classroom
    const classroom = new Classroom({
      name: name.trim(),
      classCode,
      teacher: teacherId,
      teacherName: teacher.name,
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
      teacherName: teacher.name,
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
    const { classCode, studentName, parentName } = req.body;
    const parentId = req.user.id;

    // Check if parent is already in a classroom
    const existingClassroom = await Classroom.findOne({ 'students.parent': parentId });
    if (existingClassroom) {
      return res.status(400).json({ message: 'You can only join one classroom at a time' });
    }

    // Validate input
    if (!classCode || !studentName || !parentName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find classroom by class code
    const classroom = await Classroom.findOne({ classCode: classCode.trim() });
    if (!classroom) {
      return res.status(404).json({ message: 'Invalid class code. Please check and try again.' });
    }

    // Check if parent has already joined this classroom
    const existingStudent = classroom.students.find(
      student => student.parent.toString() === parentId
    );
    if (existingStudent) {
      return res.status(400).json({ message: 'You have already joined this classroom' });
    }

    // Add student to classroom
    classroom.students.push({
      studentName,
      parentName,
      parent: parentId,
      joinedAt: new Date()
    });

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
    const parentId = req.user.id;
    const classrooms = await Classroom.find({ 'students.parent': parentId })
      .populate('teacher', 'name email') // Populate teacher details including email
      .sort({ createdAt: -1 });
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Server error while fetching classrooms' });
  }
});

// Add this new route for exiting classroom
router.post('/parent/exit-classroom', auth, async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Find classroom where this parent is enrolled
    const classroom = await Classroom.findOne({ 'students.parent': parentId });
    if (!classroom) {
      return res.status(404).json({ message: 'No classroom found for this parent' });
    }

    // Remove the student entry for this parent
    classroom.students = classroom.students.filter(
      student => student.parent.toString() !== parentId
    );

    await classroom.save();
    res.json({ message: 'Successfully exited classroom' });
  } catch (error) {
    console.error('Error exiting classroom:', error);
    res.status(500).json({ message: 'Server error while exiting classroom' });
  }
});

module.exports = router;
