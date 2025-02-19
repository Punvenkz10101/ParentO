// upload.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
console.log("upload.js file loaded");
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { email, role } = req.body;
    const file = req.file;

    if (!email || !file || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pics' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    let userModel = role === 'parent' ? Parent : Teacher;
    let user = await userModel.findOneAndUpdate(
      { email },
      { profileImage: result.secure_url },
      { new: true, upsert: true }
    );

    res.json({ message: "Image uploaded successfully", profileImage: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    let user = await Parent.findOne({ email }) || await Teacher.findOne({ email });

    if (!user || !user.profileImage) {
      return res.status(404).json({ message: "No image found" });
    }

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;