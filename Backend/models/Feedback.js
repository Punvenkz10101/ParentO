const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Behavior', 'Participation', 'Social Skills', 'Leadership', 'Other']
  },
  description: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback; 