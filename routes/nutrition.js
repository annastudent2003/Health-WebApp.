import express from "express";
import { getPool } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Log a meal
router.post("/", verifyToken, async (req, res) => {
  try {
    const { meal, calories } = req.body;
    const pool = getPool();

    await pool.query(
      "INSERT INTO nutrition (user_id, meal, calories) VALUES (?, ?, ?)",
      [req.user.id, meal, calories]
    );

    return res.json({ message: "Meal logged" });
  } catch (err) {
    console.error("❌ POST /nutrition error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// ✅ Get all logged meals
router.get("/", verifyToken, async (req, res) => {
  try {
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT * FROM nutrition WHERE user_id = ?",
      [req.user.id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("❌ GET /nutrition error:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
