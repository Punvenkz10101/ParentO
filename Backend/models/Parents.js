const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

module.exports = mongoose.model('Parent', ParentSchema, 'parentLogin');
