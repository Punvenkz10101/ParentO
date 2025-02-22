const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  studentName: { type: String }
});

module.exports = mongoose.model('Parent', ParentSchema, 'parentLogin');
