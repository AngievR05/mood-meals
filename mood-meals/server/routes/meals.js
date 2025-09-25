const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// ---------------- MULTER SETUP ---------------- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ---------------- UPLOAD IMAGE ---------------- //
router.post("/upload", verifyToken, verifyAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// ---------------- CREATE MEAL ---------------- //
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    await pool.query(
      "INSERT INTO meals (name, description, ingredients, mood, image_url, steps) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, JSON.stringify(ingredients), mood, image_url, JSON.stringify(steps || [])]
    );
    res.status(201).json({ message: "Meal added successfully" });
  } catch (err) {
    console.error("Error adding meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- UPDATE MEAL ---------------- //
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, mood, image_url, steps } = req.body;
    await pool.query(
      "UPDATE meals SET name = ?, description = ?, ingredients = ?, mood = ?, image_url = ?, steps = ? WHERE id = ?",
      [name, description, JSON.stringify(ingredients), mood, image_url, JSON.stringify(steps || []), id]
    );
    res.json({ message: "Meal updated successfully" });
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- DELETE MEAL ---------------- //
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM meals WHERE id = ?", [id]);
    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET ALL MEALS ---------------- //
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals");
    const meals = rows.map((row) => ({
      ...row,
      ingredients: JSON.parse(row.ingredients),
      steps: row.steps ? JSON.parse(row.steps) : [],
    }));
    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET MEALS BY MOOD ---------------- //
router.get("/mood/:mood", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE mood = ?", [req.params.mood]);
    const meals = rows.map((row) => ({
      ...row,
      ingredients: JSON.parse(row.ingredients),
      steps: row.steps ? JSON.parse(row.steps) : [],
    }));
    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals by mood:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET MEAL BY ID ---------------- //
// Make sure this comes AFTER /mood/:mood to avoid route conflicts
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Meal not found" });

    const meal = {
      ...rows[0],
      ingredients: JSON.parse(rows[0].ingredients),
      steps: rows[0].steps ? JSON.parse(rows[0].steps) : [],
    };

    res.json(meal);
  } catch (err) {
    console.error("Error fetching meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
