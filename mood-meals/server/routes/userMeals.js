const express = require("express");
const router = express.Router();
const { pool } = require("../config/db"); // your MySQL pool
const { verifyToken } = require("../middleware/auth");

// Get all saved meals for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT um.*, m.name, m.description, m.image_url FROM user_meals um JOIN meals m ON um.meal_id = m.id WHERE um.user_id = ? AND um.saved = 1",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch saved meals" });
  }
});

// Toggle saved meal
router.post("/:mealId/toggle", verifyToken, async (req, res) => {
  const mealId = req.params.mealId;
  const userId = req.user.id;

  try {
    // Check if a record exists
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
    console.error(err);
    res.status(500).json({ message: "Failed to toggle saved meal" });
  }
});

module.exports = router;
