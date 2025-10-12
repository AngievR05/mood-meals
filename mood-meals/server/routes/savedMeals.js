// server/routes/savedMeals.js
const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// -------------------------------
// GET all saved meals for the logged-in user
// -------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id AS meal_id, m.name, m.description, m.image_url, m.mood, um.saved
       FROM user_meals um
       JOIN meals m ON um.meal_id = m.id
       WHERE um.user_id = ? AND um.saved = 1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching saved meals:", err);
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// -------------------------------
// POST /:mealId/toggle
// Toggle saved/unsaved meal
// -------------------------------
router.post("/:mealId/toggle", verifyToken, async (req, res) => {
  const { mealId } = req.params;
  const userId = req.user.id;

  try {
    const [existing] = await pool.query(
      "SELECT saved FROM user_meals WHERE user_id = ? AND meal_id = ?",
      [userId, mealId]
    );

    if (existing.length > 0) {
      const newSavedState = existing[0].saved ? 0 : 1;
      await pool.query(
        "UPDATE user_meals SET saved = ? WHERE user_id = ? AND meal_id = ?",
        [newSavedState, userId, mealId]
      );
      return res.json({ mealId, saved: newSavedState });
    }

    await pool.query(
      "INSERT INTO user_meals (user_id, meal_id, saved) VALUES (?, ?, 1)",
      [userId, mealId]
    );

    res.json({ mealId, saved: 1 });
  } catch (err) {
    console.error("❌ Error toggling saved meal:", err);
    res.status(500).json({ message: "Failed to toggle saved meal" });
  }
});

module.exports = router;
