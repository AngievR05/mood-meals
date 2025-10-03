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
      [name, description, ingredients, mood, image_url]
    );
    res.status(201).json({ message: "Meal created successfully" });
  } catch (err) {
    console.error("Error creating meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all meals
router.get("/", async (req, res) => {
  try {
    const [meals] = await pool.query("SELECT * FROM meals");
    res.json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET saved meals for a user
router.get("/saved/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const [meals] = await pool.query(
      "SELECT m.* FROM saved_meals sm JOIN meals m ON sm.meal_id = m.id WHERE sm.user_id = ?",
      [userId]
    );
    res.json(meals);
  } catch (err) {
    console.error("Error fetching saved meals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// SAVE a meal
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { userId, mealId } = req.body;
    await pool.query(
      "INSERT INTO saved_meals (user_id, meal_id) VALUES (?, ?)",
      [userId, mealId]
    );
    res.status(201).json({ message: "Meal saved successfully" });
  } catch (err) {
    console.error("Error saving meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a saved meal
router.delete("/unsave/:userId/:mealId", verifyToken, async (req, res) => {
  try {
    const { userId, mealId } = req.params;
    await pool.query(
      "DELETE FROM saved_meals WHERE user_id = ? AND meal_id = ?",
      [userId, mealId]
    );
    res.json({ message: "Meal unsaved successfully" });
  } catch (err) {
    console.error("Error unsaving meal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
