const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  attendance: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    present: {
      type: Boolean,
      required: true,
    },
    studentName: String,
    parentName: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create a compound index for classCode and date to ensure unique attendance per day
attendanceSchema.index({ classCode: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance; 