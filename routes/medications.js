import express from "express";
import db from "../models/db.js";

const router = express.Router();

// GET all medications
router.get("/", (req, res) => {
  db.query("SELECT * FROM medications", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// POST add medication
router.post("/", (req, res) => {
  const { name, dosage, time } = req.body;
  if (!name || !dosage || !time) return res.status(400).json({ error: "All fields required" });

  const query = "INSERT INTO medications (name, dosage, time) VALUES (?, ?, ?)";
  db.query(query, [name, dosage, time], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ id: result.insertId, name, dosage, time, taken: false });
  });
});

// PUT update taken status
router.put("/:id", (req, res) => {
  const { taken } = req.body;
  const { id } = req.params;

  const query = "UPDATE medications SET taken = ? WHERE id = ?";
  db.query(query, [taken, id], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Updated successfully" });
  });
});

export default router;
