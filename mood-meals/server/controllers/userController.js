const pool = require('../config/db');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [req.user.id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get mood statistics
// @route   GET /api/user/mood-stats
// @access  Private
exports.getMoodStats = async (req, res) => {
  try {
    // This is a placeholder for now. I will implement the actual logic later.
    const moodStats = {
      mostFrequentMood: 'Happy',
      longestStreak: 10,
      moodChartData: [
        { mood: 'Happy', count: 12 },
        { mood: 'Sad', count: 3 },
        { mood: 'Angry', count: 2 },
        { mood: 'Stressed', count: 5 },
        { mood: 'Bored', count: 1 },
        { mood: 'Energised', count: 8 },
        { mood: 'Confused', count: 1 },
        { mood: 'Grateful', count: 4 },
      ],
    };
    res.json(moodStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
