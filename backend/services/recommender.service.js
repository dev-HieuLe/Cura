// services/recommender.service.js
import { DB } from "./db.service.js";

export function recommendSupplements({
  nutrients = [],
  categories = [],
  avoid = [],
  gender,
  age,
}) {
  const results = [];

  for (const product of Object.values(DB.products)) {
    const text = `
      ${product.name || ""}
      ${product.suggestedUse || ""}
      ${product.productType || ""}
    `.toLowerCase();

    if (avoid.some((a) => text.includes(a))) continue;

    let score = 0;

    nutrients.forEach((n) => {
      if (text.includes(n.toLowerCase())) score += 3;
    });

    categories.forEach((c) => {
      if (text.includes(c.toLowerCase())) score += 1;
    });

    if (gender && text.includes(gender.toLowerCase())) {
      score += 1;
    }

    if (age && age < 18 && text.includes("adult")) continue;

    if (score > 0) {
      results.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        suggestedUse: product.suggestedUse,
        pdfUrl: product.pdfUrl,
        labelUrl: product.labelUrl,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}
