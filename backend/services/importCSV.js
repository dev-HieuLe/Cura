// importCSV.js
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { db } from "../db.js";

const BATCH_SIZE = 500; // number of rows per batch

/**
 * Safe CSV loader for MySQL with batching and no duplicates
 */
async function loadCSV(filePath, table, csvHeaders, dbColumns, uniqueCols) {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        const row = dbColumns.map((col, i) => data[csvHeaders[i]] || null);
        rows.push(row);
      })
      .on("end", async () => {
        console.log(`Read ${rows.length} rows from ${filePath}`);

        try {
          for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);

            // Build placeholders for batch insert: (?, ?, ?), (?, ?, ?), ...
            const placeholders = batch
              .map(() => `(${dbColumns.map(() => "?").join(",")})`)
              .join(",");

            // Flatten batch values for mysql2 query
            const flatValues = batch.flat();

            // Build update clause for duplicates (exclude unique keys)
            const updateClause = dbColumns
              .filter((col) => !uniqueCols.includes(col))
              .map((col) => `${col} = VALUES(${col})`)
              .join(",");

            const sql = `
              INSERT INTO ${table} (${dbColumns.join(",")})
              VALUES ${placeholders}
              ON DUPLICATE KEY UPDATE ${updateClause}
            `;

            await db.query(sql, flatValues);
            console.log(
              `Inserted/Updated ${i + batch.length} rows into ${table}`
            );
          }

          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

// Only import ProductOverview CSVs
const filesToLoad = [
  {
    file: "ProductOverview_1.csv",
    table: "product_overview",
    csvHeaders: [
      "URL",
      "DSLD ID",
      "Product Name",
      "Brand Name",
      "Bar Code",
      "Net Contents",
      "Serving Size",
      "Product Type [LanguaL]",
      "Supplement Form [LanguaL]",
      "Date Entered into DSLD",
      "Market Status",
      "Suggested Use",
    ],
    dbColumns: [
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
    ],
    uniqueCols: ["dsld_id"], // prevent duplicates by dsld_id
  },
  {
    file: "ProductOverview_2.csv",
    table: "product_overview",
    csvHeaders: [
      "URL",
      "DSLD ID",
      "Product Name",
      "Brand Name",
      "Bar Code",
      "Net Contents",
      "Serving Size",
      "Product Type [LanguaL]",
      "Supplement Form [LanguaL]",
      "Date Entered into DSLD",
      "Market Status",
      "Suggested Use",
    ],
    dbColumns: [
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
    ],
    uniqueCols: ["dsld_id"], // prevent duplicates by dsld_id
  },
];

// Main function
async function importAll() {
  try {
    for (const fileConfig of filesToLoad) {
      await loadCSV(
        path.join("data", fileConfig.file),
        fileConfig.table,
        fileConfig.csvHeaders,
        fileConfig.dbColumns,
        fileConfig.uniqueCols
      );
    }
    console.log("All ProductOverview CSVs imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error importing CSVs:", err);
    process.exit(1);
  }
}

importAll();
