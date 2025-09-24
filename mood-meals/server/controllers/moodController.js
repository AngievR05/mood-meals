const { pool } = require('../config/db');

// Add or overwrite today's mood
exports.addMood = async (req, res) => {
  const { mood, note } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [existing] = await pool.query(
      'SELECT id FROM moods WHERE user_id = ? AND DATE(created_at) = ?',
      [userId, today]
    );

    if (existing.length) {
      await pool.query('UPDATE moods SET mood = ?, note = ? WHERE id = ?', [
        mood,
        note,
        existing[0].id,
      ]);
      const [rows] = await pool.query('SELECT id, mood, note, created_at FROM moods WHERE id = ?', [
        existing[0].id,
      ]);
      return res.status(200).json(rows[0]);
    }

    const [result] = await pool.query('INSERT INTO moods (user_id, mood, note) VALUES (?, ?, ?)', [
      userId,
      mood,
      note,
    ]);

    const [rows] = await pool.query('SELECT id, mood, note, created_at FROM moods WHERE id = ?', [
      result.insertId,
    ]);

    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to add mood' });
  }
};

// Get all moods
exports.getMoods = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch moods' });
  }
};

// Get today's mood
exports.getTodayMood = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC LIMIT 1',
      [userId, today]
    );
    return res.json(rows[0] || { mood: null, note: '', created_at: null });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch today\'s mood' });
  }
};

// Update mood
exports.updateMood = async (req, res) => {
  const { mood, note } = req.body;
  try {
    await pool.query(
      'UPDATE moods SET mood = ?, note = ? WHERE id = ? AND user_id = ?',
      [mood, note, req.params.id, req.user.id]
    );
    return res.json({ message: 'Mood updated' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to update mood' });
  }
};

// Delete mood
exports.deleteMood = async (req, res) => {
  try {
    await pool.query('DELETE FROM moods WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    return res.json({ message: 'Mood deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to delete mood' });
  }
};
