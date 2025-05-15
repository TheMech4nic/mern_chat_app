const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { handleSocketConnection } = require('./socket/socketHandler');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB Connection with options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Skip authentication for local development
  authSource: 'admin',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

// Try to connect to MongoDB
console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI , mongoOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Trying to connect without authentication...');
    
    // If authentication fails, try connecting without authentication
    // mongoose.connect('mongodb://localhost:27017/chat-app', {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // })
    //   .then(() => console.log('Connected to MongoDB without authentication'))
    //   .catch(err => console.error('MongoDB connection failed completely:', err));
  });

// Socket.io Connection
handleSocketConnection(io);

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 