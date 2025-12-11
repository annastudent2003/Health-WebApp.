import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getPool } from "../models/db.js";

dotenv.config();
const router = express.Router();

// ✅ Register route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const pool = getPool();

    // Check if user exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("❌ Register error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});


// ✅ Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const pool = getPool();

    // Fetch user
    const [results] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    // Check password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Database error" });
  }
});

export default router;
