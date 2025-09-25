const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getUser,
  updateUser,
  getStreak,
  getSavedMeals,
} = require('../controllers/userController');

const router = express.Router();

// GET profile
router.get('/me', verifyToken, getUser);

// UPDATE profile
router.put('/me', verifyToken, updateUser);

// GET streak
router.get('/streak', verifyToken, getStreak);

// GET saved meals
router.get('/saved-meals', verifyToken, getSavedMeals);

module.exports = router;
