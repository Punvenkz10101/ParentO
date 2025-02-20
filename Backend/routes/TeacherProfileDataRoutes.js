const express = require('express');
const router = express.Router();
const TeacherProfile = require('../models/TeacherProfileData');

router.post('/saveTeacherDetails', async (req, res) => {
  try {
    const { userName, userEmail, phoneNumber } = req.body;

    // Map userName to TeacherName when saving
    const teacherProfile = await TeacherProfile.findOneAndUpdate(
      { userEmail },
      { TeacherName: userName, userEmail, phoneNumber },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Teacher profile updated successfully', teacherProfile });
  } catch (error) {
    console.error('Error saving teacher details:', error);
    res.status(500).json({ message: 'Error saving teacher details' });
  }
});

module.exports = router;
