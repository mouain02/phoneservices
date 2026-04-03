import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { parse as parseCsvSync } from "csv-parse/sync";
import { connectDb } from "../config/db.js";
import { Brand } from "../models/Brand.js";
import { Model } from "../models/Model.js";

const PHONE_TYPES = {
  SMARTPHONE: "smartphone",
  TABLET: "tablet",
  LAPTOP: "laptop",
};

const BRAND_KEYS = ["oem", "brand", "manufacturer", "company"];
const MODEL_KEYS = ["model", "model_name", "device_name", "name", "device"];
const MODEL_CODE_KEYS = ["model_code", "model_no", "model_number", "code"];
const YEAR_KEYS = ["launch_announced", "announced", "launch_year", "year", "release_date"];

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeHeader = (header) =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const pickFirstValue = (row, keys) => {
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null) {
      continue;
    }
    const text = String(value).trim();
    if (text) {
      return text;
    }
  }
  return "";
};

const extractYear = (rawYear) => {
  if (!rawYear) {
    return undefined;
  }

  const asText = String(rawYear).trim();
  const parsedNumber = Number.parseInt(asText, 10);
  if (Number.isInteger(parsedNumber) && parsedNumber >= 1990 && parsedNumber <= 2100) {
    return parsedNumber;
  }

  const match = asText.match(/(19|20)\d{2}/);
  if (!match) {
    return undefined;
  }

  return Number.parseInt(match[0], 10);
};

const inferDeviceType = (row, modelName) => {
  const hint = [
    modelName,
    row.category,
    row.device_type,
    row.type,
    row.body_dimensions,
    row.display_type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(ipad|tablet|tab\b|pad\b|surface)/.test(hint)) {
    return PHONE_TYPES.TABLET;
  }

  if (/(laptop|notebook|macbook|thinkpad|inspiron|pavilion|xps)/.test(hint)) {
    return PHONE_TYPES.LAPTOP;
  }

  return PHONE_TYPES.SMARTPHONE;
};

const parseDatasetFile = (datasetPath) => {
  const ext = path.extname(datasetPath).toLowerCase();
  const raw = fs.readFileSync(datasetPath, "utf8");

  if (ext === ".json") {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed.records)) {
      return parsed.records;
    }
    if (Array.isArray(parsed.data)) {
      return parsed.data;
    }
    throw new Error("Unsupported JSON shape. Expected an array, data[], or records[].");
  }

  if (ext === ".csv") {
    return parseCsvSync(raw, {
      columns: (headers) => headers.map(normalizeHeader),
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      trim: true,
      bom: true,
    });
  }

  throw new Error("Unsupported file extension. Use .csv or .json dataset files.");
};

const runBulkWriteInChunks = async (ModelOrBrand, operations, chunkSize = 1000) => {
  for (let i = 0; i < operations.length; i += chunkSize) {
    const chunk = operations.slice(i, i + chunkSize);
    if (chunk.length > 0) {
      await ModelOrBrand.bulkWrite(chunk, { ordered: false });
    }
  }
};

const hasFlag = (flag) => process.argv.includes(flag);

const getArgValue = (key) => {
  const index = process.argv.findIndex((arg) => arg === key || arg.startsWith(`${key}=`));
  if (index === -1) {
    return "";
  }

  const exact = process.argv[index];
  if (exact.includes("=")) {
    return exact.split("=").slice(1).join("=").trim();
  }

  return String(process.argv[index + 1] || "").trim();
};

const importDataset = async () => {
  const fileArg = getArgValue("--file");
  if (!fileArg) {
    throw new Error("Missing --file argument. Example: npm run import:gsmarena -- --file ./datasets/gsmarena.csv");
  }

  const datasetPath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset file not found: ${datasetPath}`);
  }

  const replaceBrands = hasFlag("--replace-brands");
  const replaceModels = hasFlag("--replace-models") || replaceBrands;

  const rows = parseDatasetFile(datasetPath);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("Dataset file loaded but no rows were found.");
  }

  const dedupeCounter = new Map();
  const brandMap = new Map();
  const modelDocuments = [];

  for (const rawRow of rows) {
    const row = rawRow && typeof rawRow === "object" ? rawRow : {};
    const brandName = pickFirstValue(row, BRAND_KEYS);
    const modelName = pickFirstValue(row, MODEL_KEYS);

    if (!brandName || !modelName) {
      continue;
    }

    const brandId = slugify(brandName);
    if (!brandId) {
      continue;
    }

    const type = inferDeviceType(row, modelName);
    const modelCode = pickFirstValue(row, MODEL_CODE_KEYS);
    const year = extractYear(pickFirstValue(row, YEAR_KEYS));

    const canonicalKey = `${brandId}:${modelName.toLowerCase().trim()}`;
    const seen = dedupeCounter.get(canonicalKey) || 0;
    dedupeCounter.set(canonicalKey, seen + 1);

    const suffix = seen > 0 ? `-${seen + 1}` : "";
    const modelId = slugify(`${brandId}-${modelName}${suffix}`);
    if (!modelId) {
      continue;
    }

    const currentBrand = brandMap.get(brandId) || { key: brandId, name: brandName, types: new Set() };
    currentBrand.types.add(type);
    brandMap.set(brandId, currentBrand);

    modelDocuments.push({
      brandId,
      name: modelName,
      modelCode,
      type,
      year,
      imageUrl: "",
    });
  }

  if (brandMap.size === 0 || modelDocuments.length === 0) {
    throw new Error("No valid records found. Verify your dataset columns include brand/oem and model.");
  }

  await connectDb();

  await Promise.all([
    Brand.collection.dropIndex("id_1").catch(() => null),
    Model.collection.dropIndex("id_1").catch(() => null),
  ]);

  if (replaceModels) {
    await Model.deleteMany({});
  }

  if (replaceBrands) {
    await Brand.deleteMany({});
  }

  const brandOps = Array.from(brandMap.values()).map((brand) => ({
    updateOne: {
      filter: { name: brand.name },
      update: {
        $set: { name: brand.name, logoUrl: "" },
        $addToSet: { types: { $each: Array.from(brand.types) } },
      },
      upsert: true,
    },
  }));

  await runBulkWriteInChunks(Brand, brandOps, 300);

  const brandsFromDb = await Brand.find({
    name: { $in: Array.from(brandMap.values()).map((brand) => brand.name) },
  }).select("_id name");

  const brandObjectIdMap = new Map(
    brandsFromDb.map((brandDoc) => [
      slugify(brandDoc.name),
      brandDoc._id,
    ])
  );

  const modelOps = modelDocuments.map((model) => ({
    updateOne: {
      filter: {
        brandId: brandObjectIdMap.get(model.brandId),
        name: model.name,
      },
      update: {
        $set: {
          brandId: brandObjectIdMap.get(model.brandId),
          name: model.name,
          modelCode: model.modelCode,
          type: model.type,
          year: model.year,
          imageUrl: model.imageUrl,
        },
      },
      upsert: true,
    },
  })).filter((operation) => operation.updateOne.filter.brandId);

  await runBulkWriteInChunks(Model, modelOps, 1000);

  console.log(`Imported ${modelDocuments.length} models across ${brandMap.size} brands.`);
  console.log(`File: ${datasetPath}`);
  console.log(`replace-models: ${replaceModels ? "yes" : "no"}`);
  console.log(`replace-brands: ${replaceBrands ? "yes" : "no"}`);

  await mongoose.disconnect();
};

importDataset()
  .then(() => {
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("GSMArena dataset import failed:", error.message);
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors
    }
    process.exit(1);
  });