// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// <-- DB: import getPool instead of the old connection object
import { getPool } from "./models/db.js";

import stepsRoutes from "./routes/steps.js";
import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import symptomRoutes from "./routes/symptoms.js";
import habitRoutes from "./routes/habits.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(bodyParser.json());

// ---- DB: initialize pool and do a quick connectivity check ----
const pool = getPool(); // creates (or returns) a shared pool

async function verifyDbConnection() {
  try {
    // lightweight test query
    const [rows] = await pool.query("SELECT NOW() AS now");
    console.log("✅ MySQL pool OK — server time:", rows[0].now);
  } catch (err) {
    console.error("❌ MySQL pool test FAILED:", err && err.message ? err.message : err);
  }
}
verifyDbConnection(); // run once at startup (logged in console)

// ---- Routes (same as before) ----
app.use("/api/auth", authRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/steps", stepsRoutes);

app.get("/", (req, res) => {
  res.send("Healthcare backend is running!");
});

// Optional: a small DB-test endpoint you can call to verify connectivity easily
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    return res.status(200).json({ ok: true, now: rows[0].now });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Start server (useful for local dev). If you deploy to a platform that expects a long-running server this is fine.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown (closes pool on exit)
process.on("SIGINT", async () => {
  try {
    if (pool && typeof pool.end === "function") {
      await pool.end();
      console.log("MySQL pool closed.");
    }
  } catch (e) {
    console.error("Error closing pool:", e);
  } finally {
    process.exit(0);
  }
});

