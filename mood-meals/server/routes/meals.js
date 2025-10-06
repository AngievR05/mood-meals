const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// -------------------- IMAGE UPLOAD SETUP --------------------
const uploadsDir = path.join(__dirname, "../uploads/meals");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) return cb(new Error("Only JPEG, PNG, or WEBP allowed"));
    cb(null, true);
  },
});

// -------------------- HELPER --------------------
const safeParseJSON = (json, defaultValue = []) => {
  try { return JSON.parse(json); } catch { return defaultValue; }
};

// -------------------- CREATE MEAL (ADMIN ONLY) --------------------
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    if (!name || !mood) return res.status(400).json({ message: "Name and mood are required" });

    const moodArray = Array.isArray(mood) ? mood.map(m => m.trim()) : [mood.trim()];

    await pool.query(
      "INSERT INTO meals (name, description, ingredients, mood, image_url, steps) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), description || null, JSON.stringify(ingredients || []), JSON.stringify(moodArray), image_url || null, JSON.stringify(steps || [])]
    );

    res.status(201).json({ message: "✅ Meal added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding meal" });
  }
});

// -------------------- UPDATE MEAL (ADMIN ONLY) --------------------
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, mood, image_url, steps } = req.body;

    if (!name || !mood) return res.status(400).json({ message: "Name and mood are required" });

    const moodArray = Array.isArray(mood) ? mood.map(m => m.trim()) : [mood.trim()];

    const [result] = await pool.query(
      "UPDATE meals SET name = ?, description = ?, ingredients = ?, mood = ?, image_url = ?, steps = ? WHERE id = ?",
      [name.trim(), description || null, JSON.stringify(ingredients || []), JSON.stringify(moodArray), image_url || null, JSON.stringify(steps || []), id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Meal not found" });

    res.json({ message: "✅ Meal updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating meal" });
  }
});

// -------------------- DELETE MEAL (ADMIN ONLY) --------------------
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM meals WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "✅ Meal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting meal" });
  }
});

// -------------------- GET SINGLE MEAL --------------------
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Meal not found" });
    const meal = rows[0];
    meal.ingredients = safeParseJSON(meal.ingredients);
    meal.steps = safeParseJSON(meal.steps);
    meal.mood = safeParseJSON(meal.mood);
    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meal" });
  }
});

// -------------------- GET ALL MEALS --------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals ORDER BY created_at DESC");
    const meals = rows.map(r => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      steps: safeParseJSON(r.steps),
      mood: safeParseJSON(r.mood)
    }));
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meals" });
  }
});

// -------------------- GET MEALS BY MOOD --------------------
router.get("/mood/:mood", verifyToken, async (req, res) => {
  try {
    const moodParam = req.params.mood.toLowerCase();
    const [rows] = await pool.query(
      "SELECT * FROM meals WHERE JSON_CONTAINS(LOWER(mood), ?) ORDER BY created_at DESC",
      [`"${moodParam}"`]
    );
    const meals = rows.map(r => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      steps: safeParseJSON(r.steps),
      mood: safeParseJSON(r.mood)
    }));
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meals by mood" });
  }
});

// -------------------- UPLOAD MEAL IMAGE (ADMIN ONLY) --------------------
router.post("/upload", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/meals/${req.file.filename}`;
  res.json({ message: "✅ Image uploaded successfully", url: fileUrl });
});

module.exports = router;
