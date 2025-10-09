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

// -------------------- HELPERS --------------------
const safeParseJSON = (json, defaultValue = []) => {
  try { return JSON.parse(json); } catch { return defaultValue; }
};
const getPrimaryMood = (mood) => (!mood || typeof mood !== "string" || mood.trim() === "" ? "Happy" : mood.trim());

// -------------------- CRUD --------------------

// Create meal
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    if (!name || !mood) return res.status(400).json({ message: "Name and mood are required" });

    const primaryMood = getPrimaryMood(mood);

    await pool.query(
      "INSERT INTO meals (name, description, ingredients, mood, image_url, steps) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), description || null, JSON.stringify(ingredients || []), primaryMood, image_url || null, JSON.stringify(steps || [])]
    );

    res.status(201).json({ message: "✅ Meal added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding meal" });
  }
});

// Update meal
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    if (!name || !mood) return res.status(400).json({ message: "Name and mood are required" });

    const primaryMood = getPrimaryMood(mood);

    const [result] = await pool.query(
      "UPDATE meals SET name = ?, description = ?, ingredients = ?, mood = ?, image_url = ?, steps = ? WHERE id = ?",
      [name.trim(), description || null, JSON.stringify(ingredients || []), primaryMood, image_url || null, JSON.stringify(steps || []), id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "✅ Meal updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating meal" });
  }
});

// Delete meal
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

// Get single meal
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Meal not found" });

    const meal = rows[0];
    meal.ingredients = safeParseJSON(meal.ingredients);
    meal.steps = safeParseJSON(meal.steps);
    meal.mood = getPrimaryMood(meal.mood);

    res.json(meal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meal" });
  }
});

// Get all meals
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals ORDER BY created_at DESC");
    const meals = rows.map(r => ({
      ...r,
      ingredients: safeParseJSON(r.ingredients),
      steps: safeParseJSON(r.steps),
      mood: getPrimaryMood(r.mood),
    }));
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching meals" });
  }
});

// Upload meal image
router.post("/upload", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const backendUrl = process.env.BACKEND_URL || ""; // in prod, use full domain
  const fileUrl = `${backendUrl}/uploads/meals/${req.file.filename}`;

  res.json({ message: "✅ Image uploaded successfully", url: fileUrl });
});

module.exports = router;
