import express from "express";
import db from "../models/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, (req, res) => {
  const { meal, calories } = req.body;
  const sql = "INSERT INTO nutrition (user_id, meal, calories) VALUES (?, ?, ?)";
  db.query(sql, [req.user.id, meal, calories], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Meal logged" });
  });
});

router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT * FROM nutrition WHERE user_id = ?";
  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

export default router;
