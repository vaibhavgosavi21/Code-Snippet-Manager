const express = require('express');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
const Activity = require('../models/Activity');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSnippets = await Snippet.countDocuments();
    const recentActivities = await Activity.find()
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .limit(20);

    res.json({ totalUsers, totalSnippets, recentActivities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user activity
router.get('/users/:userId/activity', auth, adminAuth, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all snippets (admin view)
router.get('/snippets', auth, adminAuth, async (req, res) => {
  try {
    const snippets = await Snippet.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;