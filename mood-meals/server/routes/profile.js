const express = require('express');
const {
  getUser,
  updateUser,
  changePassword,
  getStreak,
  getSavedMeals,
  getMoodStats,
} = require('../controllers/userController');

const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Profile info
router.get('/', verifyToken, getUser);

// Update profile info
router.put('/', verifyToken, updateUser);

// Change password
router.put('/change-password', verifyToken, changePassword);

// Mood streak
router.get('/streak', verifyToken, getStreak);

// Saved meals
router.get('/saved-meals', verifyToken, getSavedMeals);

// Mood stats for chart
router.get('/mood-stats', verifyToken, getMoodStats);

module.exports = router;
