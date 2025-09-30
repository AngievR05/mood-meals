// controllers/userController.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// GET full profile info
exports.getUser = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, username, email, profile_picture AS avatar, tagline, dietary_prefs AS diet, mood_goal, avatar
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('getUser error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// UPDATE user profile
exports.updateUser = async (req, res) => {
  try {
    const { username, email, avatar, tagline } = req.body;
    await pool.query(
      'UPDATE users SET username=?, email=?, profile_picture=?, tagline=? WHERE id=?',
      [username, email, avatar, tagline, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// GET mood streak
exports.getStreak = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT created_at FROM moods WHERE user_id=? ORDER BY created_at DESC',
      [req.user.id]
    );

    if (!rows.length) return res.json({ streak: 0 });

    let streak = 1;
    let lastDate = new Date(rows[0].created_at).setHours(0,0,0,0);

    for (let i = 1; i < rows.length; i++) {
      const d = new Date(rows[i].created_at).setHours(0,0,0,0);
      const diff = (lastDate - d) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
      lastDate = d;
    }

    res.json({ streak });
  } catch (err) {
    console.error('getStreak error:', err);
    res.status(500).json({ error: 'Failed to get streak' });
  }
};

// GET saved meals
exports.getSavedMeals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT um.id, m.name, m.mood, m.image_url
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = ? AND um.saved = 1
       ORDER BY um.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('getSavedMeals error:', err);
    res.status(500).json({ error: 'Failed to fetch saved meals' });
  }
};

// CHANGE password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password FROM users WHERE id=?', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Old password incorrect' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hash, req.user.id]);

    res.json({ success: true });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
