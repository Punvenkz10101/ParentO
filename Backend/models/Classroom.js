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
  added 4 packages, and audited 416 packages in 6s
  
  138 packages are looking for funding
    run `npm fund` for details
  
  3 moderate severity vulnerabilities
  
  Some issues need review, and may require choosing
  a different dependency.
  
  Run `npm audit` for details.
  
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
