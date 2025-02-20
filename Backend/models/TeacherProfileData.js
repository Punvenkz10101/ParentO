const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema({
  TeacherName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);
