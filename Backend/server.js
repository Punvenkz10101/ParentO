// server.js
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import parentAuthRoutes from './routes/authParent.js'; // Correct imports
import teacherAuthRoutes from './routes/authTeacher.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
// server.js
app.use(cors({ origin: 'http://localhost:5173' })); // Allow your frontend origin

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/parent', parentAuthRoutes);
app.use('/api/teacher', teacherAuthRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));