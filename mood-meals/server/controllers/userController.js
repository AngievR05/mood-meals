const { pool } = require('../config/db');

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

// Get streak
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

      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return res.json({ streak });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch streak' });
  }
};
