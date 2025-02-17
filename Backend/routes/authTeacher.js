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
    { id: teacher._id, role: 'teacher',name:teacher.name },
     JWT_SECRET, 
     { expiresIn: '1h' });
     console.log(teacher.name)
  res.json({ token ,name:teacher.name});
});

module.exports = router;
