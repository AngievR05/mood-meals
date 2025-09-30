const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// --- PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, username, email, profile_picture AS avatar, tagline, dietary_prefs AS diet, mood_goal
       FROM users WHERE id=?`,
      [req.user.id]
    );
    if (!users.length) return res.status(404).json({ error: 'User not found' });
    const user = users[0];

    const [badges] = await pool.query(
      `SELECT id, badge_name, earned_at FROM user_badges WHERE user_id=?`,
      [req.user.id]
    );

    res.json({ ...user, badges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, avatar, tagline, diet, moodGoal } = req.body;
    await pool.query(
      'UPDATE users SET username=?, email=?, profile_picture=?, tagline=?, dietary_prefs=?, mood_goal=? WHERE id=?',
      [username, email, avatar, tagline, diet, moodGoal, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

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
    console.error(err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// --- STREAK ---
exports.getStreak = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT created_at FROM moods WHERE user_id=? ORDER BY created_at DESC', [req.user.id]);
    if (!rows.length) return res.json({ streak: 0 });

    let streak = 1;
    let lastDate = new Date(rows[0].created_at).setHours(0,0,0,0);

    for (let i = 1; i < rows.length; i++) {
      const d = new Date(rows[i].created_at).setHours(0,0,0,0);
      if ((lastDate - d)/(1000*60*60*24) === 1) streak++;
      else break;
      lastDate = d;
    }

    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get streak' });
  }
};

// --- SAVED MEALS ---
exports.getSavedMeals = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT um.id, m.name, m.mood, m.image_url
       FROM user_meals um
       JOIN meals m ON um.meal_id=m.id
       WHERE um.user_id=? AND um.saved=1
       ORDER BY um.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved meals' });
  }
};

// --- MOOD ENTRIES ---
exports.getMoodEntries = async (req,res) => {
  try {
    const range = parseInt(req.query.range) || 90;
    const [rows] = await pool.query(
      'SELECT mood, note, created_at AS date FROM moods WHERE user_id=? ORDER BY created_at DESC LIMIT ?',
      [req.user.id, range]
    );
    res.json(rows);
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch moods' }); }
};

// --- CURRENT MOOD ---
exports.getCurrentMood = async (req,res) => {
  try {
    const [rows] = await pool.query(
      'SELECT mood, note, created_at AS date FROM moods WHERE user_id=? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch current mood' }); }
};

// --- GROCERY COUNT ---
exports.getGroceryCount = async (req,res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS count FROM groceries WHERE user_id=?',[req.user.id]);
    res.json(rows[0]);
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch grocery count' }); }
};

// --- MEAL STATS ---
exports.getMealStats = async (req,res) => {
  try {
    const [streakRes] = await pool.query('SELECT COUNT(DISTINCT DATE(created_at)) AS streak FROM user_meals WHERE user_id=?',[req.user.id]);
    const [varietyRes] = await pool.query('SELECT COUNT(DISTINCT meal_id) AS variety FROM user_meals WHERE user_id=?',[req.user.id]);
    res.json({ streak: streakRes[0].streak||0, variety: varietyRes[0].variety||0 });
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch meal stats' }); }
};

// --- PREFERENCES ---
exports.getPreferences = async (req,res) => {
  try {
    const [rows] = await pool.query('SELECT dietary_prefs AS diet, mood_goal FROM users WHERE id=?',[req.user.id]);
    res.json(rows[0]||{ diet:'', moodGoal:'' });
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch preferences' }); }
};

exports.updatePreferences = async (req,res) => {
  try {
    const { diet, moodGoal } = req.body;
    await pool.query('UPDATE users SET dietary_prefs=?, mood_goal=? WHERE id=?',[diet, moodGoal, req.user.id]);
    res.json({ success:true });
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to update preferences' }); }
};

// --- JOURNAL / FEEDBACK ---
exports.getJournal = async (req,res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await pool.query(
      'SELECT id, subject, message, created_at FROM feedback WHERE user_id=? ORDER BY created_at DESC LIMIT ?',
      [req.user.id, limit]
    );
    res.json(rows);
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to fetch journal' }); }
};

exports.addJournal = async (req,res) => {
  try {
    const { text } = req.body;
    const [result] = await pool.query(
      'INSERT INTO feedback(user_id, subject, message) VALUES (?,?,?)',
      [req.user.id,'Journal Entry',text]
    );
    const [newEntry] = await pool.query('SELECT id, subject, message, created_at FROM feedback WHERE id=?',[result.insertId]);
    res.json(newEntry[0]);
  } catch(err) { console.error(err); res.status(500).json({ error: 'Failed to add journal entry' }); }
};
