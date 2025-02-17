const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  classCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a random class code
classroomSchema.statics.generateClassCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
