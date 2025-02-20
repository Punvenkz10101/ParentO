const express = require('express');
const router = express.Router();
const ParentProfile = require('../models/ParentProfileData');

router.post('/saveChildDetails', async (req, res) => {
  try {
    const { userEmail, childName, phoneNumber } = req.body;

    // Find and update if exists, otherwise create new
    const updatedProfile = await ParentProfile.findOneAndUpdate(
      { userEmail },
      { userEmail, childName, phoneNumber },
      { new: true, upsert: true }
    );

    res.status(200).json({ 
      message: "Profile updated successfully",
      data: updatedProfile 
    });
  } catch (error) {
    console.error('Error saving parent profile:', error);
    res.status(500).json({ message: "Error saving profile details" });
  }
});

// New GET route to fetch profile data
router.get('/getChildDetails/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const parentProfile = await ParentProfile.findOne({ userEmail });
    
    res.status(200).json({ parentProfile });
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ message: 'Error fetching details' });
  }
});

module.exports = router;
