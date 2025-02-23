const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tasks: [{
    type: String
  }],
  classCode: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  completions: [{
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentName: String,
    description: String,
    classCode: String,
    completedAt: { type: Date, default: Date.now },
    points: { type: Number, default: 5 }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema); 