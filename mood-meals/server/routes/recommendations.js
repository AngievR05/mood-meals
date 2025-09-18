const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// CREATE recommendation
router.post('/', verifyToken, async (req, res, next) => {
  const { mood, meal_id } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO recommendations (mood, meal_id) VALUES (?, ?)', [mood, meal_id]);
    res.json({ id: result.insertId, mood, meal_id });
  } catch (err) {
    next(err);
  }
});

// READ recommendations
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [recs] = await pool.query('SELECT * FROM recommendations ORDER BY created_at DESC');
    res.json(recs);
  } catch (err) {
    next(err);
  }
});

// UPDATE recommendation
router.put('/:id', verifyToken, async (req, res, next) => {
  const { mood, meal_id } = req.body;
  try {
    await pool.query('UPDATE recommendations SET mood = ?, meal_id = ? WHERE id = ?', [mood, meal_id, req.params.id]);
    res.json({ message: 'Recommendation updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE recommendation
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM recommendations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Recommendation deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
