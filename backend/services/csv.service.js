import fs from "fs";
import path from "path";
import csv from "csv-parser";

const dataDir = "./data";

export const DB = {
  products: {},
};

function loadCSV(filename) {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(path.join(dataDir, filename))
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
}

export async function loadAllCSVs() {
  const [label1, label2, ingredients1, ingredients2, overview1, overview2] =
    await Promise.all([
      loadCSV("LabelStatements_1.csv"),
      loadCSV("LabelStatements_2.csv"),
      loadCSV("OtherIngredients_1.csv"),
      loadCSV("OtherIngredients_2.csv"),
      loadCSV("ProductOverview_1.csv"),
      loadCSV("ProductOverview_2.csv"),
    ]);

  const all = [...overview1, ...overview2];

  all.forEach((p) => {
    const id = p["DSLD ID"];

    DB.products[id] = {
      id,
      name: p["Product Name"],
      brand: p["Brand Name"],
      suggestedUse: p["Suggested Use"],
      ingredients: [],
      formulations: [],
      pdfUrl: `https://api.ods.od.nih.gov/dsld/s3/pdf/${id}.pdf`,
      labelUrl: `https://dsld.od.nih.gov/label/${id}`,
    };
  });

  [...ingredients1, ...ingredients2].forEach((i) => {
    const product = DB.products[i["DSLD ID"]];
    if (product) {
      product.ingredients.push(i["Other Ingredients"]);
    }
  });

  [...label1, ...label2].forEach((l) => {
    if (l["Statement Type"] === "Formulation") {
      const product = DB.products[l["DSLD ID"]];
      if (product) {
        product.formulations.push(l["Statement"]);
      }
    }
  });

  console.log(`✅ Loaded ${Object.keys(DB.products).length} products`);
}
