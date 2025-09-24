const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth"); // <-- updated line


// GET all saved meals for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [savedMeals] = await pool.query(
      `SELECT m.id, m.name, m.description, m.mood, m.image_url
       FROM meals m
       INNER JOIN saved_meals sm ON m.id = sm.meal_id
       WHERE sm.user_id = ?`,
      [userId]
    );
    res.json(savedMeals);
  } catch (err) {
    console.error("Error fetching saved meals:", err);
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// POST — Save a meal
router.post("/:mealId/save", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.mealId;

    await pool.query(
      `INSERT IGNORE INTO saved_meals (user_id, meal_id) VALUES (?, ?)`,
      [userId, mealId]
    );
    res.json({ message: "Meal saved successfully" });
  } catch (err) {
    console.error("Error saving meal:", err);
    res.status(500).json({ message: "Failed to save meal" });
  }
});

// DELETE — Unsave a meal
router.delete("/:mealId/unsave", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.mealId;

    await pool.query(
      `DELETE FROM saved_meals WHERE user_id = ? AND meal_id = ?`,
      [userId, mealId]
    );
    res.json({ message: "Meal unsaved successfully" });
  } catch (err) {
    console.error("Error unsaving meal:", err);
    res.status(500).json({ message: "Failed to unsave meal" });
  }
});

module.exports = router;
