// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.put('/avatar', authMiddleware, async (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).json({ error: 'No avatar provided' });
  }
  try {
    // Find the logged-in user using the id provided by the auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Update the avatar field
    user.avatar = avatar;
    await user.save();
    res.status(200).json({ message: 'Avatar updated successfully', user });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ error: 'Server error while updating avatar' });
  }
});

module.exports = router;