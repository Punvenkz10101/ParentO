require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: ['https://parento-148ct1fca-harshakumarsms-projects.vercel.app', 'http://localhost:5173'],
    credentials: true
  } 
});

app.use(express.json());

app.use(cors({
  origin: ['https://parento-148ct1fca-harshakumarsms-projects.vercel.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');
    await printLeaderboard();
}).catch(err => console.log(err));

// Define Parent Schema
const parentSchema = new mongoose.Schema({
    name: String,
    points: { type: Number, default: 0 },
});

const Parent = mongoose.model('Parent', parentSchema);

// Define Child Task Schema
const taskSchema = new mongoose.Schema({
    parentId: mongoose.Schema.Types.ObjectId,
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);

// Add Task Completion
app.post('/task/complete', async (req, res) => {
    const { parentId } = req.body;
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    
    // Create task and reward parent
    await Task.create({ parentId, completed: true });
    parent.points += 10; // Reward 10 points for completed task
    await parent.save();
    
    // Emit updated leaderboard
    updateLeaderboard();
    
    res.json({ message: 'Task completed', points: parent.points });
});

// Deduct points if task is missed (Run this as a daily cron job)
const deductPointsForMissedTasks = async () => {
    const parents = await Parent.find();
    for (let parent of parents) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const taskExists = await Task.findOne({ parentId: parent._id, date: { $gte: today } });
        
        if (!taskExists) {
            parent.points = Math.max(0, parent.points - 5); // Deduct 5 points for missing task
            await parent.save();
        }
    }
    console.log('Daily points deduction processed.');
    updateLeaderboard();
};

// Calculate and Store Leaderboard
const calculateAndStoreLeaderboard = async () => {
    const leaderboard = await Parent.find().sort({ points: -1 });
    await mongoose.connection.db.collection('leaderboard').deleteMany({}); // Clear previous leaderboard
    await mongoose.connection.db.collection('leaderboard').insertMany(leaderboard);
    console.log('Leaderboard updated and stored in DB', leaderboard);
};

// Get Leaderboard
app.get('/leaderboard', async (req, res) => {
    const leaderboard = await mongoose.connection.db.collection('leaderboard').find().toArray();
    res.json(leaderboard);
});

// Print leaderboard
const printLeaderboard = async () => {
    const leaderboard = await Parent.find().sort({ points: -1 });
    console.log('Current Leaderboard:', leaderboard);
};

// Emit leaderboard updates
const updateLeaderboard = async () => {
    await calculateAndStoreLeaderboard();
    const leaderboard = await Parent.find().sort({ points: -1 });
    io.emit('leaderboardUpdate', leaderboard);
    console.log('Leaderboard Updated:', leaderboard);
};

// WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Run points deduction daily at midnight (use a cron job in production)
setInterval(deductPointsForMissedTasks, 24 * 60 * 60 * 1000);

// Initialize database with sample data
const initializeDatabase = async () => {
    await Parent.deleteMany({});
    await Task.deleteMany({});
    
    const parents = await Parent.insertMany([
        { name: "Alice", points: 50 },
        { name: "Bob", points: 40 },
        { name: "Charlie", points: 30 },
        { name: "David", points: 20 },
        { name: "Eve", points: 10 }
    ]);
    
    await Task.insertMany([
        { parentId: parents[0]._id, completed: true, date: new Date() },
        { parentId: parents[1]._id, completed: false, date: new Date() },
        { parentId: parents[2]._id, completed: true, date: new Date() },
        { parentId: parents[3]._id, completed: false, date: new Date() },
        { parentId: parents[4]._id, completed: false, date: new Date() }
    ]);
    
    console.log('Database initialized with sample data');
    await updateLeaderboard();
    await printLeaderboard();
};

initializeDatabase();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
