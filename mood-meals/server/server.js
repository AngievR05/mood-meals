require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { pool } = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const moodsRoutes = require('./routes/moods');
const mealsRoutes = require('./routes/meals');
const groceriesRouter = require('./routes/groceries');
const recommendationsRoutes = require('./routes/recommendations');
const savedMealsRoutes = require("./routes/savedMeals");
const userMealsRoutes = require("./routes/userMeals");
const feedbackRouter = require("./routes/feedback");
const profileRoutes = require("./routes/profile");
const friendsRoutes = require("./routes/friends");

const app = express();

// ------------------ SECURITY & CORS ------------------
app.use(helmet());
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ------------------ STATIC UPLOADS ------------------
const uploadsPath = path.join(__dirname, 'uploads');
app.use(
  '/uploads',
  cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }),
  express.static(uploadsPath, {
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

// ------------------ HEALTH CHECK ------------------
app.get('/', (req, res) =>
  res.json({ ok: true, msg: 'Mood Meals backend alive 🚀' })
);

// ------------------ ROUTES ------------------
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/groceries', groceriesRouter);
app.use('/api/recommendations', recommendationsRoutes);
app.use("/api/saved-meals", savedMealsRoutes);
app.use("/api/user-meals", userMealsRoutes);
app.use("/api/feedback", feedbackRouter);
app.use("/api/profile", profileRoutes);
app.use("/api/friends", friendsRoutes);

// ------------------ FRONTEND FALLBACK (Production) ------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../client/build");
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ------------------ 404 & ERROR HANDLING ------------------
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ------------------ SERVER START ------------------
const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool connected');

    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
    );
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
}

start();

