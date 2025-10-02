const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// -------------------------------
// GET all saved meals for the logged-in user (with full meal info)
// -------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id, m.name, m.description, m.image_url, m.mood
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = ? AND um.saved = 1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching saved meals:", err);
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// -------------------------------
// POST /:mealId/toggle
// Toggle save/unsave a meal for the logged-in user
// -------------------------------
router.post("/:mealId/toggle", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM user_meals WHERE user_id = ? AND meal_id = ?",
      [userId, mealId]
    );

    if (existing.length > 0) {
      // Meal is already saved → remove
      await pool.query(
        "DELETE FROM user_meals WHERE user_id = ? AND meal_id = ?",
        [userId, mealId]
      );
      return res.json({ saved: false });
    }

    // Meal not saved → insert
    await pool.query(
      "INSERT INTO user_meals (user_id, meal_id, saved) VALUES (?, ?, 1)",
      [userId, mealId]
    );
    res.json({ saved: true });
  } catch (err) {
    console.error("Error toggling save:", err);
    res.status(500).json({ message: "Failed to toggle save" });
  }
});

// -------------------------------
// POST /:mealId/save
// Explicitly save a meal
// -------------------------------
router.post("/:mealId/save", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    await pool.query(
      "INSERT IGNORE INTO user_meals (user_id, meal_id, saved) VALUES (?, ?, 1)",
      [userId, mealId]
    );
    res.json({ saved: true });
  } catch (err) {
    console.error("Error saving meal:", err);
    res.status(500).json({ message: "Failed to save meal" });
  }
});

// -------------------------------
// DELETE /:mealId/unsave
// Explicitly remove a saved meal
// -------------------------------
router.delete("/:mealId/unsave", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    await pool.query(
      "DELETE FROM user_meals WHERE user_id = ? AND meal_id = ?",
      [userId, mealId]
    );
    res.json({ saved: false });
  } catch (err) {
    console.error("Error unsaving meal:", err);
    res.status(500).json({ message: "Failed to unsave meal" });
  }
});

module.exports = router;
