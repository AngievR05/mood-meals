const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ------------------ UPLOAD SETUP ------------------
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

// Helper to safely parse JSON
const safeParseJSON = (json, defaultValue = []) => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

// ------------------ ROUTES ------------------

// Upload meal image
router.post("/upload", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const fullUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ imageUrl: fullUrl });
});

// Create a new meal
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    const [result] = await pool.query(
      `INSERT INTO meals 
       (name, description, ingredients, mood, image_url, steps, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, description, JSON.stringify(ingredients), mood, image_url, JSON.stringify(steps || [])]
    );
    res.status(201).json({ message: "Meal added successfully", mealId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a meal
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    await pool.query(
      `UPDATE meals SET 
         name = ?, description = ?, ingredients = ?, mood = ?, image_url = ?, steps = ? 
       WHERE id = ?`,
      [name, description, JSON.stringify(ingredients), mood, image_url, JSON.stringify(steps || []), id]
    );
    res.json({ message: "Meal updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a meal
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM meals WHERE id = ?", [id]);
    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get meal by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Meal not found" });
    const meal = rows[0];
    meal.ingredients = safeParseJSON(meal.ingredients);
    meal.steps = safeParseJSON(meal.steps);
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all meals
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals ORDER BY created_at DESC");
    const meals = rows.map((r) => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      steps: safeParseJSON(r.steps),
    }));
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get meals by mood (case-insensitive, filtered in SQL)
router.get("/mood/:mood", verifyToken, async (req, res) => {
  try {
    const moodParam = req.params.mood.toLowerCase();
    const [rows] = await pool.query("SELECT * FROM meals WHERE LOWER(mood) = ? ORDER BY created_at DESC", [moodParam]);
    const meals = rows.map(r => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      steps: safeParseJSON(r.steps),
    }));
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
