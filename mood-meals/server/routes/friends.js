const express = require("express");
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET all friends
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email
       FROM friends f
       JOIN users u ON f.friend_id = u.id
       WHERE f.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ADD friend
router.post("/", verifyToken, async (req, res) => {
  let { friendEmail } = req.body;

  if (!friendEmail) {
    return res.status(400).json({ error: "Friend email is required" });
  }

  friendEmail = friendEmail.trim().toLowerCase(); // sanitize

  try {
    // Check friend exists
    const [users] = await pool.query(
      "SELECT id, username FROM users WHERE LOWER(email) = ?",
      [friendEmail]
    );

    if (!users.length) return res.status(404).json({ error: "User not found" });

    const friendId = users[0].id;

    // Cannot add yourself
    if (friendId === req.user.id) {
      return res.status(400).json({ error: "Cannot add yourself" });
    }

    // Already friends?
    const [existing] = await pool.query(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
      [req.user.id, friendId]
    );
    if (existing.length) return res.status(400).json({ error: "Already friends" });

    // Insert friend
    await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES (?, ?)",
      [req.user.id, friendId]
    );

    res.json({ success: true, friendId, friendName: users[0].username });
  } catch (err) {
    console.error("Error adding friend:", err);

    // MySQL duplicate entry
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already friends" });
    }

    // MySQL foreign key error
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Friend does not exist" });
    }

    res.status(500).json({ error: "Server error" });
  }
});

// REMOVE friend
router.delete("/:friendId", verifyToken, async (req, res) => {
  const { friendId } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM friends WHERE user_id = ? AND friend_id = ?",
      [req.user.id, friendId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Friend not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
