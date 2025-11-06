// routes/symptom.js
import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/symptom
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Please describe your symptoms." });
  }

  const searchTerm = encodeURIComponent(message.split(" ")[0]); // use first word as keyword

  try {
    // Free public medical data API (no key or login)
    const apiRes = await axios.get(
      `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${searchTerm}`
    );

    const conditions = apiRes.data[3] || [];
    const possible = conditions.slice(0, 3).join(", ") || "No matching conditions found";

    // Home-care and prevention advice
    const tips = [
      "💧 Stay hydrated and drink warm water.",
      "🥗 Eat balanced meals and include fruits and vegetables.",
      "🛏️ Get enough rest and sleep well.",
      "☕ Try warm fluids like soup or tea if you have a cold.",
      "🚶 Light exercise or stretching can improve recovery.",
    ];

    let customTip = "";
    const lower = message.toLowerCase();

    if (lower.includes("fever")) customTip = "Use a cool compress, rest, and stay hydrated.";
    else if (lower.includes("cough")) customTip = "Try honey with warm water or herbal tea.";
    else if (lower.includes("headache")) customTip = "Massage temples and drink more fluids.";
    else if (lower.includes("cold")) customTip = "Steam inhalation and vitamin C-rich foods help.";
    else if (lower.includes("stomach")) customTip = "Eat light foods and avoid oily or spicy meals.";

    res.json({
      reply: `Possible conditions: ${possible}. 🩺\n\nHome-care advice: ${
        customTip || tips[Math.floor(Math.random() * tips.length)]
      }`,
    });
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({
      reply: "Sorry, unable to fetch info right now. Please try again later.",
    });
  }
});

export default router;
