const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Teacher Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const teacher = await Teacher.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Teacher Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const teacher = await Teacher.findOne({ email });

  if (!teacher) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: teacher._id, role: 'teacher', name: teacher.name, email: teacher.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    name: teacher.name,
    email: teacher.email,
    userId: teacher._id
  });
});

// Add profile update route
router.put('/profile/:id', async (req, res) => {
  try {
    const { phone } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { phone },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add GET route for fetching profile
router.get('/profile/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({
      phone: teacher.phone
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
