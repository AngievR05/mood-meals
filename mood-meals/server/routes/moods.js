const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// CREATE mood
router.post('/', verifyToken, async (req, res, next) => {
  const { mood, note } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO moods (user_id, mood, note) VALUES (?, ?, ?)', [req.user.id, mood, note]);
    res.json({ id: result.insertId, mood, note });
  } catch (err) {
    next(err);
  }
});

// READ moods
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [moods] = await pool.query('SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(moods);
  } catch (err) {
    next(err);
  }
});

// UPDATE mood
router.put('/:id', verifyToken, async (req, res, next) => {
  const { mood, note } = req.body;
  try {
    await pool.query('UPDATE moods SET mood = ?, note = ? WHERE id = ? AND user_id = ?', [mood, note, req.params.id, req.user.id]);
    res.json({ message: 'Mood updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE mood
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM moods WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Mood deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
