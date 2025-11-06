import express from "express";
import db from "../models/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/summary", verifyToken, (req, res) => {
  const userId = req.user.id;

  const summary = {};

  db.query("SELECT COUNT(*) AS total, SUM(taken) AS taken FROM medications WHERE user_id = ?", [userId], (err, meds) => {
    if (err) return res.status(500).json(err);
    summary.medicationAdherence = meds[0].total ? (meds[0].taken / meds[0].total) * 100 : 0;

    db.query("SELECT SUM(calories) AS totalCalories FROM nutrition WHERE user_id = ?", [userId], (err, cal) => {
      if (err) return res.status(500).json(err);
      summary.calories = cal[0].totalCalories || 0;

      db.query("SELECT COUNT(*) AS symptomsLogged FROM symptoms WHERE user_id = ?", [userId], (err, sym) => {
        if (err) return res.status(500).json(err);
        summary.symptomCount = sym[0].symptomsLogged;

        db.query("SELECT AVG(streak) AS avgStreak FROM habits WHERE user_id = ?", [userId], (err, hab) => {
          if (err) return res.status(500).json(err);
          summary.habitStreak = hab[0].avgStreak || 0;

          res.json(summary);
        });
      });
    });
  });
});

export default router;
