import express from "express";
import { getPool } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = getPool();

    const summary = {};

    // 1) Medication adherence
    const [meds] = await pool.query(
      "SELECT COUNT(*) AS total, SUM(taken) AS taken FROM medications WHERE user_id = ?",
      [userId]
    );
    const totalMeds = meds[0].total || 0;
    const takenMeds = meds[0].taken || 0;
    summary.medicationAdherence = totalMeds ? (takenMeds / totalMeds) * 100 : 0;

    // 2) Calories summary
    const [cal] = await pool.query(
      "SELECT SUM(calories) AS totalCalories FROM nutrition WHERE user_id = ?",
      [userId]
    );
    summary.calories = cal[0].totalCalories || 0;

    // 3) Symptom count
    const [sym] = await pool.query(
      "SELECT COUNT(*) AS symptomsLogged FROM symptoms WHERE user_id = ?",
      [userId]
    );
    summary.symptomCount = sym[0].symptomsLogged || 0;

    // 4) Habit streak
    const [hab] = await pool.query(
      "SELECT AVG(streak) AS avgStreak FROM habits WHERE user_id = ?",
      [userId]
    );
    summary.habitStreak = hab[0].avgStreak || 0;

    return res.json(summary);
  } catch (err) {
    console.error("❌ /analytics/summary error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
