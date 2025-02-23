require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const parentAuthRoutes = require('./routes/authParent');
const teacherAuthRoutes = require('./routes/authTeacher');
const classroomRoutes = require('./routes/classroom');
const announcementRoutes = require('./routes/announcement');
const http = require('http');
const { Server } = require('socket.io');
const activitiesRoutes = require('./routes/activities');

// Register models
require('./models/Teacher');
require('./models/Parent');
require('./models/Classroom');
require('./models/Announcement');
require('./models/Activity');
require('./models/Attendance');
require('./models/Marks');
require('./models/Feedback');

const app = express();
const server = http.createServer(app);

// Basic CORS middleware
app.use(cors({
  origin: ['https://parento.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://parento.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['https://parento.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  path: '/socket.io/'
});

// Socket.IO error handling
io.engine.on("connection_error", (err) => {
  console.log('Socket.IO connection error:', err);
});

// Add error handling for Socket.IO server
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join classroom room
  socket.on('join_classroom', (classCode) => {
    socket.join(classCode);
    console.log(`Socket ${socket.id} joined classroom ${classCode}`);
  });

  // Leave classroom room
  socket.on('leave_classroom', (classCode) => {
    socket.leave(classCode);
    console.log(`Socket ${socket.id} left classroom ${classCode}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'ParentO API is running' });
});

// Register routes once
app.use('/api/parent', parentAuthRoutes);
app.use('/api/teacher', teacherAuthRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/activities', activitiesRoutes);

// Make Socket.IO instance available to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Add error handling for the server
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('Port 3000 requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port 3000 is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Add proper shutdown handling
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server terminated');
  });
});
