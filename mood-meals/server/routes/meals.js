const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth"); // 👈 fixed

// CREATE new meal (admin-only for now)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, ingredients, mood, image_url } = req.body;
    await pool.query(
      "INSERT INTO meals (name, description, ingredients, mood, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, JSON.stringify(ingredients), mood, image_url]
    );
    res.status(201).json({ message: "Meal added successfully" });
  } catch (err) {
    console.error("Error adding meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all meals
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET meals by mood
router.get("/mood/:mood", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE mood = ?", [
      req.params.mood,
    ]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching meals by mood:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET meal by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Meal not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
