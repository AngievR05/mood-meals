const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET profile
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json(users[0]);
  } catch (err) {
    next(err);
  }
});

// GET streak
router.get('/streak', verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get the last 30 moods for the user, descending
    const [moods] = await pool.query(
      'SELECT created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
      [userId]
    );

    if (!moods.length) return res.json({ streak: 0 });

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < moods.length; i++) {
      const moodDate = new Date(moods[i].created_at);
      moodDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today - moodDate) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    next(err);
  }
});


// UPDATE profile
router.put('/me', verifyToken, async (req, res, next) => {
  const { username, email } = req.body;
  try {
    await pool.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
