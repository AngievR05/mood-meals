const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// GET profile info
exports.getUser = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, username, email FROM users WHERE id = ?', [
      req.user.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
};

// UPDATE profile info (username/email)
exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    await pool.execute('UPDATE users SET username = ?, email = ? WHERE id = ?', [
      username,
      email,
      req.user.id,
    ]);
    return res.json({ message: 'Profile updated' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
};

// CHANGE password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!valid) return res.status(400).json({ error: 'Old password incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.id]);

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to change password' });
  }
};

// GET mood streak
exports.getStreak = async (req, res) => {
  try {
    const userId = req.user.id;
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

      if (diffDays === streak) streak++;
      else if (diffDays > streak) break;
    }

    return res.json({ streak });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch streak' });
  }
};

// GET saved meals
exports.getSavedMeals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT um.id, m.id AS meal_id, m.name, m.description, m.mood, m.image_url
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = ? AND um.saved = 1`,
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch saved meals' });
  }
};

// GET mood stats for chart
exports.getMoodStats = async (req, res) => {
  try {
    const [moods] = await pool.query(
      'SELECT mood, COUNT(*) as count FROM moods WHERE user_id = ? GROUP BY mood',
      [req.user.id]
    );
    return res.json(moods);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch mood stats' });
  }
};
