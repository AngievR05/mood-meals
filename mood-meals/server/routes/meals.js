const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// CREATE new meal (admin-only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
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

// UPDATE meal (admin-only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, mood, image_url } = req.body;
    await pool.query(
      "UPDATE meals SET name = ?, description = ?, ingredients = ?, mood = ?, image_url = ? WHERE id = ?",
      [name, description, JSON.stringify(ingredients), mood, image_url, id]
    );
    res.json({ message: "Meal updated successfully" });
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE meal (admin-only)
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

// GET all meals (any logged-in user)
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM meals");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET meals by mood (any logged-in user)
router.get("/mood/:mood", verifyToken, async (req, res) => {
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

// GET meal by ID (any logged-in user)
router.get("/:id", verifyToken, async (req, res) => {
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
