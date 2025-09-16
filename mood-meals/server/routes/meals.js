const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   GET /api/meals
// @desc    Get all meals for the logged-in user
// @access  Private
router.get('/', auth, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT * FROM meals WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ msg: 'Database error', err });
    res.json(results);
  });
});

// @route   POST /api/meals
// @desc    Add a new meal
// @access  Private
router.post('/', auth, (req, res) => {
  const { name, category, mood, ingredients } = req.body;
  const userId = req.user.id;

  if (!name || !category || !mood) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  const sql = 'INSERT INTO meals (user_id, name, category, mood, ingredients) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [userId, name, category, mood, ingredients], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error', err });
    res.json({ msg: 'Meal added successfully', mealId: result.insertId });
  });
});

// @route   PUT /api/meals/:id
// @desc    Update a meal
// @access  Private
router.put('/:id', auth, (req, res) => {
  const { name, category, mood, ingredients } = req.body;
  const userId = req.user.id;
  const mealId = req.params.id;

  const sql = 'UPDATE meals SET name=?, category=?, mood=?, ingredients=? WHERE id=? AND user_id=?';
  db.query(sql, [name, category, mood, ingredients, mealId, userId], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error', err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Meal not found or unauthorized' });
    }
    res.json({ msg: 'Meal updated successfully' });
  });
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', auth, (req, res) => {
  const userId = req.user.id;
  const mealId = req.params.id;

  const sql = 'DELETE FROM meals WHERE id=? AND user_id=?';
  db.query(sql, [mealId, userId], (err, result) => {
    if (err) return res.status(500).json({ msg: 'Database error', err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Meal not found or unauthorized' });
    }
    res.json({ msg: 'Meal deleted successfully' });
  });
});

module.exports = router;
