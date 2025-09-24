require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { pool } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const moodsRoutes = require('./routes/moods');
const mealsRoutes = require('./routes/meals');
const groceriesRouter = require('./routes/groceries');
const recommendationsRoutes = require('./routes/recommendations');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ ok: true, msg: 'Mood Meals backend alive 🚀' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/groceries', groceriesRouter);
app.use('/api/recommendations', recommendationsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Serve uploaded images
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_TRIES = 10;

async function start(port = DEFAULT_PORT, attempt = 0) {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool connected');

    const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (attempt < MAX_PORT_TRIES) {
          console.warn(`⚠️ Port ${port} busy, trying ${port + 1}...`);
          start(port + 1, attempt + 1);
        } else {
          console.error(`❌ No free ports after ${MAX_PORT_TRIES} tries. Exiting.`);
          process.exit(1);
        }
      } else {
        console.error(err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

start();
