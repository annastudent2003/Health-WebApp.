// routes/symptoms.js
import express from "express";
import axios from "axios";

const router = express.Router();

// POST /api/symptoms
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Please describe your symptoms." });
  }

  // Use first word in message as search keyword
  const searchTerm = encodeURIComponent(message.split(" ")[0]);

  try {
    // Public medical lookup API (no key needed)
    const apiRes = await axios.get(
      `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${searchTerm}`
    );

    const conditions = apiRes.data?.[3] || [];
    const possible =
      conditions.length > 0
        ? conditions.slice(0, 3).join(", ")
        : "No matching conditions found";

    // Helpful home-care tips
    const tips = [
      "💧 Stay hydrated and drink warm water.",
      "🥗 Eat balanced meals with fruits and vegetables.",
      "🛏️ Get enough rest and quality sleep.",
      "☕ Warm fluids like soup or tea can help.",
      "🚶 Gentle stretching or light walking may improve recovery.",
    ];

    // Condition-specific advice
    const lower = message.toLowerCase();
    let customTip = "";

    if (lower.includes("fever")) customTip = "Use a cool compress and stay hydrated.";
    else if (lower.includes("cough")) customTip = "Try honey with warm water or herbal tea.";
    else if (lower.includes("headache")) customTip = "Massage your temples and drink more fluids.";
    else if (lower.includes("cold")) customTip = "Steam inhalation and vitamin C-rich foods help.";
    else if (lower.includes("stomach"))
      customTip = "Avoid oily foods; prefer light meals and hydration.";

    return res.json({
      reply: `Possible conditions: ${possible}.\n\nHome-care advice: ${
        customTip || tips[Math.floor(Math.random() * tips.length)]
      }`,
    });
  } catch (err) {
    console.error("❌ Symptoms API error:", err.message);
    return res.status(500).json({
      reply: "Sorry, unable to fetch info right now. Please try again later.",
    });
  }
});

export default router;
