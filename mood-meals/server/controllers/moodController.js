const { pool } = require('../config/db');

exports.addMood = async (req, res, next) => {
  try {
    const { mood, note } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO moods (user_id, mood, note) VALUES (?, ?, ?)',
      [req.user.id, mood, note]
    );
    res.status(201).json({ id: result.insertId, mood, note });
  } catch (err) {
    next(err);
  }
};

exports.getMoods = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM moods WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.updateMood = async (req, res, next) => {
  try {
    const { mood, note } = req.body;
    await pool.execute('UPDATE moods SET mood = ?, note = ? WHERE id = ? AND user_id = ?', [
      mood,
      note,
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: 'Mood updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteMood = async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM moods WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: 'Mood deleted' });
  } catch (err) {
    next(err);
  }
};
