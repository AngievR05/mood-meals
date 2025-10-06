// routes/moods.js
const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

/**
 * ✅ CREATE a new mood entry
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { mood, note } = req.body;
    const userId = req.user.id;

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    await pool.query(
      "INSERT INTO moods (user_id, mood, note, created_at) VALUES (?, ?, ?, NOW())",
      [userId, mood, note || null]
    );

    res.status(201).json({ message: "✅ Mood entry added successfully" });
  } catch (error) {
    console.error("❌ Error adding mood:", error);
    res.status(500).json({ message: "Server error while adding mood" });
  }
});

/**
 * ✅ GET all moods for the logged-in user
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching moods:", error);
    res.status(500).json({ message: "Server error while fetching moods" });
  }
});

/**
 * ✅ GET the most recent mood (/api/moods/latest)
 */
router.get("/latest", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No mood found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching latest mood:", error);
    res.status(500).json({ message: "Server error while fetching latest mood" });
  }
});

/**
 * ✅ GET today's mood (/api/moods/today)
 */
router.get("/today", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM moods WHERE user_id = ? AND DATE(created_at) = CURDATE()",
      [userId]
    );

    res.json(rows[0] || null);
  } catch (error) {
    console.error("❌ Error fetching today's mood:", error);
    res.status(500).json({ message: "Server error while fetching today's mood" });
  }
});

/**
 * ✅ Fallback: /api/moods/current (for backward compatibility)
 */
router.get("/current", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    res.json(rows[0] || null);
  } catch (error) {
    console.error("❌ Error fetching current mood:", error);
    res.status(500).json({ message: "Server error while fetching current mood" });
  }
});

/**
 * ✅ DELETE a mood entry
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const moodId = req.params.id;
    const userId = req.user.id;

    const [result] = await pool.query(
      "DELETE FROM moods WHERE id = ? AND user_id = ?",
      [moodId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Mood not found or unauthorized" });
    }

    res.json({ message: "✅ Mood deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting mood:", error);
    res.status(500).json({ message: "Server error while deleting mood" });
  }
});

module.exports = router;
