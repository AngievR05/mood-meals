const express = require("express");
const { pool } = require("../config/db");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET groceries
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, item_name, quantity, purchased FROM groceries WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST grocery
router.post("/", verifyToken, async (req, res) => {
  const { item_name, quantity } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO groceries (user_id, item_name, quantity, purchased) VALUES (?, ?, ?, ?)",
      [req.user.id, item_name, quantity || "1 unit", 0]
    );
    res.json({
      id: result.insertId,
      user_id: req.user.id,
      item_name,
      quantity: quantity || "1 unit",
      purchased: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT grocery
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { item_name, quantity, purchased } = req.body;

  try {
    await pool.query(
      "UPDATE groceries SET item_name = ?, quantity = ?, purchased = ? WHERE id = ? AND user_id = ?",
      [item_name, quantity, purchased, id, req.user.id]
    );
    res.json({ id, item_name, quantity, purchased });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE grocery
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM groceries WHERE id = ? AND user_id = ?", [id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
