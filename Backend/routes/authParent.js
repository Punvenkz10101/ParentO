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

  const token = jwt.sign({ id: parent._id, role: 'parent' }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
