// routes/moods.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addMood, getMoods, updateMood, deleteMood } = require('../controllers/moodController');

router.post('/', auth, addMood);
router.get('/', auth, getMoods);
router.put('/:id', auth, updateMood);
router.delete('/:id', auth, deleteMood);
// GET /api/moods/test
router.get('/test', (req, res) => {
  res.json({ ok: true, msg: 'moods route working' });
});

module.exports = router;
