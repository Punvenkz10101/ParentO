const mongoose = require('mongoose');

const parentProfileSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  childName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('ParentProfile', parentProfileSchema);
