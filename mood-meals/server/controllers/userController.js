// controllers/userController.js
const { pool } = require('../config/db');

exports.getUser = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [
      req.user.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    await pool.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [
      username,
      email,
      req.user.id,
    ]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};
