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

const app = express();
const server = http.createServer(app);

// Update CORS configuration to be more flexible
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS to Express
app.use(cors(corsOptions));
app.use(express.json());

// Configure Socket.IO with updated CORS
const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
});

// Socket.IO connection handling
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add error handling for the server
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error('Port 5000 requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port 5000 is already in use');
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
