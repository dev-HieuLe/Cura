import { parseUserText } from "../services/gemini.service.js";
import { recommendSupplements } from "../services/recommender.service.js";
import { CATEGORY_TO_NUTRIENTS } from "../utils/categoryToNutrients.js";

function parseFormText(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const data = {};

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    data[line.slice(0, idx).toLowerCase()] = line.slice(idx + 1).trim();
  }

  return {
    gender: data.gender || "",
    age: Number(data.age) || null,
    allergies: data.allergies || "",
    problem: data.problem || "",
  };
}

export async function recommend(req, res) {
  try {
    const rawText = req.body.text || "";
    const { gender, age, allergies, problem } = parseFormText(rawText);

    const parsed = await parseUserText(problem);

    // 🚨 MEDICAL HARD STOP
    if (parsed.intent === "medical") {
      return res.json({
        intent: "medical",
        isMedical: true,
        message:
          "This appears to be a medical request. Please consult a healthcare professional.",
        advice: "",
        recommendations: [],
      });
    }

    // 🔁 INFER NUTRIENTS FROM CATEGORIES
    let nutrients = parsed.nutrients;
    if (nutrients.length === 0 && parsed.categories.length > 0) {
      nutrients = [
        ...new Set(
          parsed.categories.flatMap((c) => CATEGORY_TO_NUTRIENTS[c] || [])
        ),
      ];
    }

    const allergyList = allergies
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    const avoid = [...new Set([...allergyList, ...parsed.avoid])];

    const recommendations = recommendSupplements({
      nutrients,
      categories: parsed.categories,
      avoid,
      gender,
      age,
    });

    res.json({
      intent: "wellness",
      parsed: {
        nutrients,
        categories: parsed.categories,
        avoid,
      },
      advice: parsed.advice,
      recommendations,
    });
  } catch (err) {
    console.error("❌ Recommend controller error:", err);
    res.status(500).json({ error: "Recommendation failed" });
  }
}
