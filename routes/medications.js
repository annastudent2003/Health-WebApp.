import express from "express";
import { getPool } from "../db.js";

const router = express.Router();

// ✅ GET all medications
router.get("/", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM medications");
    res.json(rows);
  } catch (err) {
    console.error("❌ GET /medications error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ POST add medication
router.post("/", async (req, res) => {
  try {
    const { name, dosage, time } = req.body;
    if (!name || !dosage || !time)
      return res.status(400).json({ error: "All fields required" });

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO medications (name, dosage, time) VALUES (?, ?, ?)",
      [name, dosage, time]
    );

    return res.status(201).json({
      id: result.insertId,
      name,
      dosage,
      time,
      taken: false,
    });
  } catch (err) {
    console.error("❌ POST /medications error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ PUT update taken status
router.put("/:id", async (req, res) => {
  try {
    const { taken } = req.body;
    const { id } = req.params;

    const pool = getPool();
    await pool.query("UPDATE medications SET taken = ? WHERE id = ?", [
      taken,
      id,
    ]);

    return res.json({ message: "Updated successfully" });
  } catch (err) {
    console.error("❌ PUT /medications/:id error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

export default router;
