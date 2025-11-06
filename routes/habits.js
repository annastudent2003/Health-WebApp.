import express from "express";
import db from "../models/db.js";

const router = express.Router();

// get all habits
router.get("/", (req, res) => {
  db.query("SELECT * FROM habits", (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result);
  });
});

// add new habit
router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });

  db.query("INSERT INTO habits (name, streak) VALUES (?, 0)", [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Insert failed" });
    res.json({ id: result.insertId, name, streak: 0 });
  });
});

// increment streak
router.put("/:id/checkin", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE habits SET streak = streak + 1 WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });
    res.json({ message: "Streak incremented" });
  });
});

export default router;
