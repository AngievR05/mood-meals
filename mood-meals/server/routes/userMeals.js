const express = require("express");
const router = express.Router();
const { pool } = require("../config/db"); // your MySQL pool
const { verifyToken } = require("../middleware/auth");

// -------------------------------
// GET all saved meals for current user
// -------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT um.*, m.name, m.description, m.image_url 
       FROM user_meals um 
       JOIN meals m ON um.meal_id = m.id 
       WHERE um.user_id = ? AND um.saved = 1`,
      [req.user.id]
    );
    res.json(rows); // returns full meal info for saved meals
  } catch (err) {
    console.error("Error fetching saved meals:", err);
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// -------------------------------
// POST /:mealId/toggle
// Toggle saved state of a meal
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
      // Toggle saved value
      const saved = existing[0].saved ? 0 : 1;
      await pool.query(
        "UPDATE user_meals SET saved = ? WHERE user_id = ? AND meal_id = ?",
        [saved, userId, mealId]
      );
      return res.json({ mealId, saved });
    } else {
      // Insert as saved
      await pool.query(
        "INSERT INTO user_meals (user_id, meal_id, saved) VALUES (?, ?, 1)",
        [userId, mealId]
      );
      return res.json({ mealId, saved: 1 });
    }
  } catch (err) {
    console.error("Error toggling saved meal:", err);
    res.status(500).json({ message: "Failed to toggle saved meal" });
  }
});

// -------------------------------
// Optional explicit save
// -------------------------------
router.post("/:mealId/save", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    await pool.query(
      "INSERT INTO user_meals (user_id, meal_id, saved) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE saved = 1",
      [userId, mealId]
    );
    res.json({ mealId, saved: 1 });
  } catch (err) {
    console.error("Error saving meal:", err);
    res.status(500).json({ message: "Failed to save meal" });
  }
});

// -------------------------------
// Optional explicit unsave
// -------------------------------
router.delete("/:mealId/unsave", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    await pool.query(
      "UPDATE user_meals SET saved = 0 WHERE user_id = ? AND meal_id = ?",
      [userId, mealId]
    );
    res.json({ mealId, saved: 0 });
  } catch (err) {
    console.error("Error unsaving meal:", err);
    res.status(500).json({ message: "Failed to unsave meal" });
  }
});

module.exports = router;
