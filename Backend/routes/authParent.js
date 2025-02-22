const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Parent = require('../models/Parent');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Parent Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const parent = await Parent.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Parent registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Parent Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const parent = await Parent.findOne({ email });

  if (!parent) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, parent.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: parent._id, role: 'parent', name: parent.name, email: parent.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  res.json({ 
    token,
    name: parent.name,
    email: parent.email,
    userId: parent._id
  });
});

// Add this route to handle profile updates
router.put('/profile/:id', async (req, res) => {
  try {
    const { phone, studentName } = req.body;
    const parent = await Parent.findByIdAndUpdate(
      req.params.id,
      { phone, studentName },
      { new: true }
    );
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
