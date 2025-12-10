// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./routes/db.js"; // uses the pool above

// your route imports (adjust paths if needed)
import stepsRoutes from "./routes/steps.js";
import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import symptomRoutes from "./routes/symptoms.js";
import habitRoutes from "./routes/habits.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());

// Simple health + DB test routes
app.get("/", (req, res) => {
  res.send("Healthcare backend is running!");
});

app.get("/api/db-test", async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT NOW() AS now");
    return res.status(200).json({ ok: true, now: rows[0].now });
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Mount your real routes (make sure each route uses getPool())
app.use("/api/auth", authRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/steps", stepsRoutes);

// IMPORTANT for Vercel: do NOT call app.listen()
// Export the Express `app` as the default export so Vercel's Node runtime can call it.
export default app;
