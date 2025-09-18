const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// CREATE meal
router.post('/', verifyToken, async (req, res, next) => {
  const { name, description, calories } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO meals (name, description, calories) VALUES (?, ?, ?)', [name, description, calories]);
    res.json({ id: result.insertId, name, description, calories });
  } catch (err) {
    next(err);
  }
});

// READ meals
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [meals] = await pool.query('SELECT * FROM meals ORDER BY created_at DESC');
    res.json(meals);
  } catch (err) {
    next(err);
  }
});

// UPDATE meal
router.put('/:id', verifyToken, async (req, res, next) => {
  const { name, description, calories } = req.body;
  try {
    await pool.query('UPDATE meals SET name = ?, description = ?, calories = ? WHERE id = ?', [name, description, calories, req.params.id]);
    res.json({ message: 'Meal updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE meal
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM meals WHERE id = ?', [req.params.id]);
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
