const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// ----------------------------
// GET all friends and pending requests
// ----------------------------
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [friends] = await pool.query(
      `SELECT f.id AS friendship_id,
              u.id AS friend_id,
              u.username,
              u.profile_picture,
              f.status,
              -- latest mood
              (SELECT mood FROM moods WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) AS latest_mood,
              (SELECT created_at FROM moods WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) AS mood_time,
              -- latest meal
              (SELECT m.name FROM user_meals um
               JOIN meals m ON um.meal_id = m.id
               WHERE um.user_id = u.id ORDER BY um.created_at DESC LIMIT 1) AS last_meal
       FROM friends f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = ?`,
      [userId]
    );

    res.json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching friends" });
  }
});

// ----------------------------
// SEND friend request
// ----------------------------
router.post("/add", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  if (!friendId || friendId == userId) {
    return res.status(400).json({ error: "Invalid friend ID" });
  }

  try {
    // Check if friendship already exists
    const [existing] = await pool.query(
      "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
      [userId, friendId]
    );

    if (existing.length) {
      return res.status(400).json({ error: "Friend request already sent or already friends" });
    }

    await pool.query(
      "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending')",
      [userId, friendId]
    );

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending friend request" });
  }
});

// ----------------------------
// ACCEPT friend request
// ----------------------------
router.post("/accept", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendshipId } = req.body;

  try {
    // Update the friendship
    const [result] = await pool.query(
      "UPDATE friends SET status = 'accepted' WHERE id = ? AND friend_id = ? AND status = 'pending'",
      [friendshipId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Friend request not found" });
    }

    // Create reciprocal friendship
    const [original] = await pool.query("SELECT * FROM friends WHERE id = ?", [friendshipId]);
    const senderId = original[0].user_id;

    await pool.query(
      "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'accepted')",
      [userId, senderId]
    );

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error accepting friend request" });
  }
});

// ----------------------------
// REJECT friend request
// ----------------------------
router.post("/reject", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendshipId } = req.body;

  try {
    const [result] = await pool.query(
      "DELETE FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'",
      [friendshipId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Friend request not found" });
    }

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error rejecting friend request" });
  }
});

// ----------------------------
// REMOVE friend
// ----------------------------
router.delete("/:friendId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    // Delete both sides of friendship
    await pool.query(
      "DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
      [userId, friendId, friendId, userId]
    );

    res.json({ message: "Friend removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error removing friend" });
  }
});

// ----------------------------
// SEND encouragement message
// ----------------------------
router.post("/encourage", verifyToken, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).json({ error: "Missing receiver or message" });
  }

  try {
    await pool.query(
      "INSERT INTO friend_encouragements (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [senderId, receiverId, message]
    );

    res.json({ message: "Encouragement sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending encouragement" });
  }
});

module.exports = router;
