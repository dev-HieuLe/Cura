import { GoogleGenerativeAI } from "@google/generative-ai";

let model = null;

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  return model;
}

export async function parseUserText(text) {
  const prompt = `
You are a wellness intent classifier.

Your task:
1. Determine if the user's request is MEDICAL or WELLNESS
2. Extract supplement-relevant intent that users will need ONLY if wellness
3. Extract nutrient keywords that users will benefit from if applicable
4. Extract wellness categories
5. Extract avoidance substances

Definitions:
- MEDICAL = asking about diseases, diagnosis, treatment, medicine, antibiotics, prescriptions, or curing conditions
- WELLNESS = general health support, nutrition, energy, recovery, prevention, daily supplementation

Rules:
- If MEDICAL:
  - set "intent" = "medical"
- If WELLNESS:
  - set "intent" = "wellness"
  - nutrients MUST be concrete searchable words like:
    zinc, vitamin b12, vitamin d, magnesium, iron, omega 3, probiotics, selenium, calcium
- categories must be from this list ONLY:
energy
fatigue
focus
memory
stress
anxiety
sleep
immunity
digestion
gut
muscle
strength
recovery
endurance
heart
circulation
bone
joint
skin
hair
hormone
metabolism
liver
detox
eye

Besides, write a SHORT lifestyle advice (~60 words)
- advice MUST start with:
"Besides these supplements, you should ..."


Return JSON ONLY.

JSON format:
{
  "intent": "medical" | "wellness",
  "nutrients": [],
  "categories": [],
  "avoid": [],
  "advice": ""
}

Text:
"""${text}"""
`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);

    const clean = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const parsed = JSON.parse(clean);

    return {
      intent: parsed.intent === "medical" ? "medical" : "wellness",
      nutrients: Array.isArray(parsed.nutrients) ? parsed.nutrients : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid : [],
      advice: typeof parsed.advice === "string" ? parsed.advice : "",
    };
  } catch (err) {
    console.error("❌ Gemini parsing error:", err.message);
    return {
      intent: "medical",
      nutrients: [],
      categories: [],
      avoid: [],
      advice: "",
    };
  }
}
