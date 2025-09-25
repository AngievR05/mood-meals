const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// POST feedback (user submits feedback)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { subject, message, attachments } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      "INSERT INTO feedback (user_id, subject, message, attachments) VALUES (?, ?, ?, ?)",
      [userId, subject, message, JSON.stringify(attachments || [])]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error saving feedback:", err);
    res.status(500).json({ success: false, error: "Failed to save feedback" });
  }
});

// GET feedback (users see their own, admins see all)
router.get("/", verifyToken, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      // Admins get everything
      query = `
        SELECT f.*, u.username, u.email
        FROM feedback f
        LEFT JOIN users u ON f.user_id = u.id
        ORDER BY f.created_at DESC
      `;
      params = [];
    } else {
      // Regular users only see their own
      query = "SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC";
      params = [req.user.id];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// (Optional) Admin route to resolve feedback
router.patch("/:id/resolve", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { id } = req.params;
    await pool.query("UPDATE feedback SET status = 'resolved' WHERE id = ?", [id]);

    res.json({ success: true, message: `Feedback #${id} marked as resolved` });
  } catch (err) {
    console.error("❌ Error resolving feedback:", err);
    res.status(500).json({ error: "Failed to update feedback status" });
  }
});

module.exports = router;
