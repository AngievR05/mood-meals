const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  addMood,
  getMoods,
  getTodayMood,
  updateMood,
  deleteMood,
} = require('../controllers/moodController');

const router = express.Router();

// CRUD routes
router.post('/', verifyToken, addMood);
router.get('/', verifyToken, getMoods);
router.get('/today', verifyToken, getTodayMood);
router.put('/:id', verifyToken, updateMood);
router.delete('/:id', verifyToken, deleteMood);

module.exports = router;
