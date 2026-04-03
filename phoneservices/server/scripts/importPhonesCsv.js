import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { parse as parseCsvSync } from "csv-parse/sync";
import { connectDb } from "../config/db.js";
import { Brand } from "../models/Brand.js";
import { Model } from "../models/Model.js";

const DEFAULT_CSV_PATH = path.resolve(process.cwd(), "data", "phones.csv");

const readCsvFile = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseCsvSync(raw, {
    columns: (headers) =>
      headers.map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")),
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
    trim: true,
    bom: true,
  });
};

const importPhonesCsv = async () => {
  const providedPath = process.argv[2];
  const resolvedCsvPath = providedPath ? path.resolve(process.cwd(), providedPath) : DEFAULT_CSV_PATH;

  if (!fs.existsSync(resolvedCsvPath)) {
    throw new Error(`CSV file not found: ${resolvedCsvPath}`);
  }

  console.log(`Reading CSV from: ${resolvedCsvPath}`);

  const rows = await readCsvFile(resolvedCsvPath);
  if (rows.length === 0) {
    throw new Error("CSV file is empty or malformed");
  }

  console.log(`Found ${rows.length} rows in CSV`);

  await connectDb();

  // Remove legacy unique indexes from previous string-id schema.
  await Promise.all([
    Brand.collection.dropIndex("id_1").catch(() => null),
    Model.collection.dropIndex("id_1").catch(() => null),
  ]);

  // Clear existing data
  await Promise.all([Brand.deleteMany({}), Model.deleteMany({})]);

  const brandSet = new Map(); // Map of brand name to brand doc

  // Step 1: Create unique brands
  for (const row of rows) {
    const brandName = row.brand || row.manufacturer || row.company || row.oem;
    if (!brandName || !brandName.trim()) continue;

    const normalizedBrand = brandName.trim();
    if (!brandSet.has(normalizedBrand)) {
      const brand = await Brand.create({
        name: normalizedBrand,
        types: ["smartphone"],
        logoUrl: "",
      });
      brandSet.set(normalizedBrand, brand);
      console.log(`Created brand: ${normalizedBrand}`);
    }
  }

  console.log(`Total brands created: ${brandSet.size}`);

  // Step 2: Create models with ObjectId references
  const seenModels = new Set();
  let modelCount = 0;

  for (const row of rows) {
    const brandName = row.brand || row.manufacturer || row.company || row.oem;
    const modelName = row.model || row.model_name || row.device_name || row.name;

    if (!brandName || !modelName) continue;

    const normalizedBrand = brandName.trim();
    const normalizedModel = modelName.trim();
    const dedupeKey = `${normalizedBrand}|${normalizedModel}`;

    if (seenModels.has(dedupeKey)) continue;
    seenModels.add(dedupeKey);

    const brand = brandSet.get(normalizedBrand);
    if (!brand) continue;

    const modelCode = row.model_code || row.model_number || row.code || "";
    const year = row.year || row.launch_year || row.announced;
    const yearNum = year ? Number.parseInt(year, 10) : undefined;

    try {
      await Model.create({
        brandId: brand._id,
        name: normalizedModel,
        modelCode: modelCode.trim(),
        type: "smartphone",
        year: Number.isInteger(yearNum) ? yearNum : undefined,
        imageUrl: "",
      });
      modelCount++;
    } catch (err) {
      console.warn(`Skipping model "${normalizedModel}": ${err.message}`);
    }
  }

  console.log(`Total models created: ${modelCount}`);
  console.log("CSV import completed successfully!");

  await mongoose.disconnect();
};

importPhonesCsv()
  .then(() => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Import failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors
    }
    process.exit(1);
  });
