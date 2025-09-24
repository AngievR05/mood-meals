const { pool } = require('../config/db');

// Add or overwrite today's mood
exports.addMood = async (req, res, next) => {
  const { mood, note } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Check if today’s mood exists
    const [existing] = await pool.query(
      'SELECT id FROM moods WHERE user_id = ? AND DATE(created_at) = ?',
      [userId, today]
    );

    if (existing.length) {
      // Update existing
      await pool.query(
        'UPDATE moods SET mood = ?, note = ? WHERE id = ?',
        [mood, note, existing[0].id]
      );
      const [rows] = await pool.query(
        'SELECT id, mood, note, created_at FROM moods WHERE id = ?',
        [existing[0].id]
      );
      return res.status(200).json(rows[0]);
    }

    // Insert new mood
    const [result] = await pool.query(
      'INSERT INTO moods (user_id, mood, note) VALUES (?, ?, ?)',
      [userId, mood, note]
    );

    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Get all moods
exports.getMoods = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// Get today's mood only
exports.getTodayMood = async (req, res, next) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const [rows] = await pool.query(
      'SELECT id, mood, note, created_at FROM moods WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC LIMIT 1',
      [userId, today]
    );

    if (!rows.length) return res.json({ mood: null, note: '', created_at: null });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update a mood
exports.updateMood = async (req, res, next) => {
  const { mood, note } = req.body;
  try {
    await pool.query(
      'UPDATE moods SET mood = ?, note = ? WHERE id = ? AND user_id = ?',
      [mood, note, req.params.id, req.user.id]
    );
    res.json({ message: 'Mood updated' });
  } catch (err) {
    next(err);
  }
};

// Delete a mood
exports.deleteMood = async (req, res, next) => {
  try {
    await pool.query(
      'DELETE FROM moods WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Mood deleted' });
  } catch (err) {
    next(err);
  }
};
