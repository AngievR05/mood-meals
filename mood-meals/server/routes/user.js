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
