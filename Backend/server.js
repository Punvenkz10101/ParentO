require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const parentAuthRoutes = require('./routes/authParent');
const teacherAuthRoutes = require('./routes/authTeacher');

const classroomRoutes = require('./routes/classroom');
const announcementRoutes = require('./routes/announcement');


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/parent', parentAuthRoutes);
app.use('/api/teacher', teacherAuthRoutes);

app.use('/api/classroom', classroomRoutes);
app.use('/api/announcement', announcementRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
