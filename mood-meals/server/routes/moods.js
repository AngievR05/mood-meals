const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// CREATE mood (overwrites today's mood if exists)
router.post('/', verifyToken, async (req, res, next) => {
  const { mood, note } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Check if today's mood exists
    const [existing] = await pool.query(
      'SELECT id FROM moods WHERE user_id = ? AND DATE(created_at) = ?',
      [userId, today]
    );

    if (existing.length) {
      // Update existing
      const [updated] = await pool.query(
        'UPDATE moods SET mood = ?, note = ? WHERE id = ?',
        [mood, note, existing[0].id]
      );
      const [rows] = await pool.query('SELECT id, mood, note, created_at FROM moods WHERE id = ?', [existing[0].id]);
      return res.json(rows[0]);
    }

    // Insert new mood
    const [result] = await pool.query(
      'INSERT INTO moods (user_id, mood, note) VALUES (?, ?, ?)',
      [userId, mood, note]
    );

    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE id = ?',
      [result.insertId]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// READ all moods
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [moods] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(moods);
  } catch (err) {
    next(err);
  }
});

// GET today's mood
router.get('/today', verifyToken, async (req, res, next) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC LIMIT 1',
      [userId, today]
    );

    if (!rows.length) return res.json({ mood: null, note: '', created_at: null });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// UPDATE mood
router.put('/:id', verifyToken, async (req, res, next) => {
  const { mood, note } = req.body;
  try {
    await pool.query(
      'UPDATE moods SET mood = ?, note = ? WHERE id = ? AND user_id = ?',
      [mood, note, req.params.id, req.user.id]
    );
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
