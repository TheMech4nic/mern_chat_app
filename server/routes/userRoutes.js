const express = require('express');
const { 
  registerUser, 
  loginUser,
  logoutUser,
  getUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/', protect, getUsers);

module.exports = router; 