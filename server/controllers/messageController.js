const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user._id;

    if (!content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const newMessage = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content
    });

    // Populate sender information
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username isOnline')
      .populate('recipient', 'username isOnline');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Find messages where current user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username isOnline')
      .populate('recipient', 'username isOnline');

    // Mark messages as read where current user is the recipient
    await Message.updateMany(
      { sender: userId, recipient: currentUserId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 