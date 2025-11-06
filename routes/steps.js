// backend/routes/steps.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const weight = 160; 
    const duration = 45;
    const activity = "walking";

    const response = await axios.get("https://api.api-ninjas.com/v1/caloriesburned", {
      params: { activity, weight, duration },
      headers: { "X-Api-Key": "bC/tDRmVlAuUw/4BIQ8iig==LyfmhifT5CQtdH5j" },
    });

    const totalCalories = response.data[0]?.total_calories || 0;
    const steps = Math.round(totalCalories / 0.04);

    res.json({ steps, calories: totalCalories });
  } catch (err) {
    console.error("❌ Steps API failed:", err.message);
    res.status(500).json({ steps: 0, calories: 0 });
  }
});

export default router;
