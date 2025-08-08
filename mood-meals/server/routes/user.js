const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getMoodStats,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/user/profile
// @desc    Get user profile data
// @access  Private
router.get('/profile', authMiddleware, getUserProfile);

// @route   GET api/user/mood-stats
// @desc    Get user mood statistics
// @access  Private
router.get('/mood-stats', authMiddleware, getMoodStats);

module.exports = router;
