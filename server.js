import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import db from "./models/db.js";
import stepsRoutes from "./routes/steps.js";



import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import symptomRoutes from "./routes/symptoms.js";
import habitRoutes from "./routes/habits.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/steps", stepsRoutes);
app.get("/", (req, res) => {
  res.send("Healthcare backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
