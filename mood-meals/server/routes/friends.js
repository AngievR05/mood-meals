const express = require("express"); 
const router = express.Router();
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// GET all friends + pending requests, separated
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1️⃣ Pending requests RECEIVED
    const [pendingReceived] = await pool.query(
      `
      SELECT f.id AS friendship_id, f.user_id AS requester_id, f.friend_id,
             u.username, u.profile_picture
      FROM friends f
      JOIN users u ON u.id = f.user_id
      WHERE f.friend_id = ? AND f.status = 'pending'
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    // 2️⃣ Pending requests SENT
    const [pendingSent] = await pool.query(
      `
      SELECT f.id AS friendship_id, f.user_id AS requester_id, f.friend_id,
             u.username, u.profile_picture
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ? AND f.status = 'pending'
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    // 3️⃣ Accepted friends
    const [accepted] = await pool.query(
      `
      SELECT f.id AS friendship_id,
             CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END AS friend_id,
             u.username, u.profile_picture,
             lm.mood AS latest_mood, lm.created_at AS mood_time,
             lm2.meal_name AS last_meal
      FROM friends f
      JOIN users u ON u.id = CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END
      LEFT JOIN (
        SELECT m.user_id, m.mood, m.created_at
        FROM moods m
        INNER JOIN (
          SELECT user_id, MAX(created_at) AS max_created
          FROM moods
          GROUP BY user_id
        ) t ON t.user_id = m.user_id AND t.max_created = m.created_at
      ) lm ON lm.user_id = u.id
      LEFT JOIN (
        SELECT um.user_id, m.name AS meal_name
        FROM user_meals um
        JOIN meals m ON um.meal_id = m.id
        INNER JOIN (
          SELECT user_id, MAX(created_at) AS max_created
          FROM user_meals
          GROUP BY user_id
        ) t2 ON t2.user_id = um.user_id AND t2.max_created = um.created_at
      ) lm2 ON lm2.user_id = u.id
      WHERE f.status = 'accepted' AND (f.user_id = ? OR f.friend_id = ?)
      ORDER BY u.username ASC
      `,
      [userId, userId, userId, userId]
    );

    res.json({ pendingReceived, pendingSent, accepted });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Error fetching friends" });
  }
});


// SEND friend request
router.post("/add", verifyToken, async (req, res) => {
  const userId = req.user.id;
  let { friendIdentifier } = req.body;

  if (!friendIdentifier) return res.status(400).json({ error: "Missing friend identifier" });

  try {
    if (typeof friendIdentifier === "string") {
      const [rows] = await pool.query(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        [friendIdentifier, friendIdentifier]
      );
      if (!rows.length) return res.status(400).json({ error: "User not found" });
      friendIdentifier = rows[0].id;
    }

    if (friendIdentifier == userId)
      return res.status(400).json({ error: "Cannot add yourself" });

    const [existing] = await pool.query(
      "SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
      [userId, friendIdentifier, friendIdentifier, userId]
    );
    if (existing.length)
      return res.status(400).json({ error: "Friend request already exists or already friends" });

    await pool.query(
      "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending')",
      [userId, friendIdentifier]
    );

    res.json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({ error: "Error sending friend request" });
  }
});

// ACCEPT friend request
router.post("/accept", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendshipId } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE friends SET status = 'accepted' WHERE id = ? AND friend_id = ? AND status = 'pending'",
      [friendshipId, userId]
    );

    if (result.affectedRows === 0)
      return res.status(400).json({ error: "Friend request not found or already handled" });

    res.json({ message: "Friend request accepted successfully" });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ error: "Error accepting friend request" });
  }
});

// REJECT friend request
router.post("/reject", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { friendshipId } = req.body;

  try {
    const [result] = await pool.query(
      "DELETE FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'",
      [friendshipId, userId]
    );

    if (result.affectedRows === 0)
      return res.status(400).json({ error: "Friend request not found or already handled" });

    res.json({ message: "Friend request rejected successfully" });
  } catch (err) {
    console.error("Error rejecting friend request:", err);
    res.status(500).json({ error: "Error rejecting friend request" });
  }
});

// REMOVE friend
router.delete("/:friendId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.friendId;

  try {
    await pool.query(
      "DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
      [userId, friendId, friendId, userId]
    );
    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ error: "Error removing friend" });
  }
});

// SEND encouragement message
router.post("/encourage", verifyToken, async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  if (!receiverId || !message)
    return res.status(400).json({ error: "Missing receiver or message" });

  try {
    await pool.query(
      "INSERT INTO friend_encouragements (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [senderId, receiverId, message]
    );
    res.json({ message: "Encouragement sent successfully!" });
  } catch (err) {
    console.error("Error sending encouragement:", err);
    res.status(500).json({ error: "Error sending encouragement" });
  }
});

module.exports = router;
