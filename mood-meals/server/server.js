require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { pool } = require('./config/db'); // mysql2 promise pool
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // update file names if you use plural 'users'
const moodsRoutes = require('./routes/moods'); // optional, only if present
const mealsRoutes = require('./routes/meals'); // optional
const groceriesRoutes = require('./routes/groceries'); // optional
const recommendationsRoutes = require('./routes/recommendations'); // optional
const errorHandler = require('./middleware/errorHandler'); // use the error handler from earlier

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// health
app.get('/', (req, res) => res.json({ ok: true, msg: 'Mood Meals backend is alive 🚀' }));

// mount APIs (keep your existing route paths like /api/auth if you prefer)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/groceries', groceriesRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // quick DB sanity check
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to connect to DB on startup:', err.message);
    process.exit(1); // crash early so you fix env / DB
  }
}

start();
