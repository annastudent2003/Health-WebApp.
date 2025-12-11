import express from "express";
import { getPool } from "../models/db.js";

const router = express.Router();

// ✅ Get all habits
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM habits");
    res.json(rows);
  } catch (err) {
    console.error("❌ GET /habits error:", err);
    return res.status(500).json({ message: "DB error" });
  }
});

// ✅ Add new habit
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO habits (name, streak) VALUES (?, 0)",
      [name]
    );

    return res.json({
      id: result.insertId,
      name,
      streak: 0,
    });
  } catch (err) {
    console.error("❌ POST /habits error:", err);
    return res.status(500).json({ message: "Insert failed" });
  }
});

// ✅ Increment streak
router.put("/:id/checkin", async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();
    await pool.query("UPDATE habits SET streak = streak + 1 WHERE id = ?", [
      id,
    ]);

    return res.json({ message: "Streak incremented" });
  } catch (err) {
    console.error("❌ PUT /habits/:id/checkin error:", err);
    return res.status(500).json({ message: "Update failed" });
  }
});

export default router;
