const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classCode: {
    type: String,
    required: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  students: [{
    studentName: {
      type: String,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Generate a unique class code
classroomSchema.statics.generateClassCode = async function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let classCode;
  let isUnique = false;

  while (!isUnique) {
    classCode = '';
    for (let i = 0; i < 6; i++) {
      classCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if the generated code already exists
    const existingClass = await this.findOne({ classCode });
    if (!existingClass) {
      isUnique = true;
    }
  }

  return classCode;
};

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
