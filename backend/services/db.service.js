// services/db.service.js
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { db } from "../db.js";

export const DB = {
  products: {},
};

/**
 * Load entire table from MySQL
 */
async function loadTable(table) {
  const [rows] = await db.query(`SELECT * FROM \`${table}\``);
  return rows;
}

/**
 * Load all products and cache in memory
 */
export async function loadAllFromDB() {
  const overview = await loadTable("product_overview");

  DB.products = {}; // reset cache

  // 🧱 Build product base
  overview.forEach((p) => {
    const dsldId = p.dsld_id;
    if (!dsldId) return;

    DB.products[dsldId] = {
      id: dsldId,
      name: p.product_name,
      brand: p.brand_name,
      suggestedUse: p.suggested_use,
      productType: p.product_type_langual,
      ingredients: [], // already handled in other tables
      formulations: [], // already handled in other tables
      pdfUrl: `https://api.ods.od.nih.gov/dsld/s3/pdf/${dsldId}.pdf`,
      labelUrl: `https://dsld.od.nih.gov/label/${dsldId}`,
    };
  });

  console.log(
    `Loaded ${Object.keys(DB.products).length} products from product_overview`
  );
}

/**
 * Safe CSV import for product_overview only
 * Prevents duplicates using ON DUPLICATE KEY
 */
async function importProductOverviewCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Map CSV → DB columns
        rows.push([
          row["URL"] || null,
          row["DSLD ID"] || null,
          row["Product Name"] || null,
          row["Brand Name"] || null,
          row["Bar Code"] || null,
          row["Net Contents"] || null,
          row["Serving Size"] || null,
          row["Product Type [LanguaL]"] || null,
          row["Supplement Form [LanguaL]"] || null,
          row["Date Entered into DSLD"] || null,
          row["Market Status"] || null,
          row["Suggested Use"] || null,
        ]);
      })
      .on("end", async () => {
        try {
          const dbColumns = [
            "url",
            "dsld_id",
            "product_name",
            "brand_name",
            "bar_code",
            "net_contents",
            "serving_size",
            "product_type_langual",
            "supplement_form_langual",
            "date_entered",
            "market_status",
            "suggested_use",
          ];

          // placeholders for prepared statement
          const placeholders = dbColumns.map(() => "?").join(",");

          // update clause for ON DUPLICATE KEY (exclude unique key dsld_id)
          const updateClause = dbColumns
            .filter((col) => col !== "dsld_id")
            .map((col) => `${col} = VALUES(${col})`)
            .join(",");

          for (const rowValues of rows) {
            await db.query(
              `INSERT INTO product_overview (${dbColumns.join(",")})
               VALUES (${placeholders})
               ON DUPLICATE KEY UPDATE ${updateClause}`,
              rowValues
            );
          }

          console.log(`Imported ${rows.length} rows into product_overview`);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

/**
 * Import all product_overview CSVs safely
 */
export async function importAllProductOverviewCSVs() {
  try {
    const files = ["ProductOverview_1.csv", "ProductOverview_2.csv"];
    for (const file of files) {
      await importProductOverviewCSV(path.join("data", file));
    }
    console.log("All product_overview CSVs imported successfully!");
  } catch (err) {
    console.error("Error importing product_overview CSVs:", err);
  }
}
