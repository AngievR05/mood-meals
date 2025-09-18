const express = require('express');
const { pool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// CREATE grocery
router.post('/', verifyToken, async (req, res, next) => {
  const { item_name, quantity } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO groceries (user_id, item_name, quantity) VALUES (?, ?, ?)', [req.user.id, item_name, quantity]);
    res.json({ id: result.insertId, item_name, quantity });
  } catch (err) {
    next(err);
  }
});

// READ groceries
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const [groceries] = await pool.query('SELECT * FROM groceries WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(groceries);
  } catch (err) {
    next(err);
  }
});

// UPDATE grocery
router.put('/:id', verifyToken, async (req, res, next) => {
  const { item_name, quantity, purchased } = req.body;
  try {
    await pool.query('UPDATE groceries SET item_name = ?, quantity = ?, purchased = ? WHERE id = ? AND user_id = ?', [item_name, quantity, purchased, req.params.id, req.user.id]);
    res.json({ message: 'Grocery updated' });
  } catch (err) {
    next(err);
  }
});

// DELETE grocery
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    await pool.query('DELETE FROM groceries WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Grocery deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
