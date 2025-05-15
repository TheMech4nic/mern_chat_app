const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store active user connections
const activeUsers = new Map();

// Handle socket connections
exports.handleSocketConnection = (io) => {
  io.use(async (socket, next) => {
    try {
      // Get token from handshake auth
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      
      // Add user to active users
      const user = await User.findById(decoded.id);
      if (user) {
        // Update user status to online
        user.isOnline = true;
        await user.save();
      }
      
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store user connection
    activeUsers.set(socket.userId, socket.id);
    
    // Emit online status to all users
    io.emit('userStatus', {
      userId: socket.userId,
      status: true
    });

    // Handle private messages
    socket.on('privateMessage', async (data) => {
      const { recipientId, message } = data;
      const recipientSocketId = activeUsers.get(recipientId);
      
      if (recipientSocketId) {
        // Send message to recipient
        io.to(recipientSocketId).emit('privateMessage', {
          senderId: socket.userId,
          message
        });
      }
    });

    // Handle typing status
    socket.on('typing', (data) => {
      const { recipientId, isTyping } = data;
      const recipientSocketId = activeUsers.get(recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', {
          senderId: socket.userId,
          isTyping
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Remove user from active users
      activeUsers.delete(socket.userId);
      
      // Update user status to offline
      try {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
        
        // Emit offline status to all users
        io.emit('userStatus', {
          userId: socket.userId,
          status: false
        });
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    });
  });
}; 