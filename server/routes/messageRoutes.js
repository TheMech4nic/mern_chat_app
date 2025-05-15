const express = require('express');
const { 
  sendMessage,
  getMessages
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All message routes are protected
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessages);

module.exports = router; 