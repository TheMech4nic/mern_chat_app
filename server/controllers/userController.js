const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password)

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create new user
    const user = await User.create({
      username,
      password
    });
    console.log('user', user)

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        isOnline: user.isOnline,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update online status
    user.isOnline = true;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      isOnline: user.isOnline,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout user
exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Update user status to offline
    await User.findByIdAndUpdate(userId, { isOnline: false });
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('-password');
      
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 