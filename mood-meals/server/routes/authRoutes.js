const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db'); // your MySQL connection
const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Email already exists or DB error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { id: rows[0].id, email: rows[0].email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
