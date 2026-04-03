import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "../config/db.js";
import { DeviceType } from "../models/DeviceType.js";
import { Brand } from "../models/Brand.js";
import { Model } from "../models/Model.js";
import { AdminUser } from "../models/AdminUser.js";
import {
  brands as defaultBrands,
  deviceTypes as defaultDeviceTypes,
  models as defaultModels,
} from "../data/defaultCatalog.js";

const seed = async () => {
  await connectDb();

  await Promise.all([
    DeviceType.deleteMany({}),
    Brand.deleteMany({}),
    Model.deleteMany({}),
  ]);

  await DeviceType.insertMany(defaultDeviceTypes, { ordered: false });

  // Create brands and map their IDs
  const brandMap = new Map(); // Maps brand slug (e.g., "apple") to MongoDB _id
  for (const brandData of defaultBrands) {
    const { id: brandSlug, ...brandDoc } = brandData;
    const createdBrand = await Brand.create(brandDoc);
    brandMap.set(brandSlug, createdBrand._id);
  }

  // Create models with ObjectId references to brands
  const modelsWithObjectIds = defaultModels.map((model) => {
    const { id, brandId: brandSlug, ...modelDoc } = model;
    const brandObjectId = brandMap.get(brandSlug);
    if (!brandObjectId) {
      throw new Error(`Brand "${brandSlug}" not found for model "${modelDoc.name}"`);
    }
    return { ...modelDoc, brandId: brandObjectId };
  });
  await Model.insertMany(modelsWithObjectIds, { ordered: false });

  const email = (process.env.ADMIN_EMAIL || "admin@phoneservices.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const role = process.env.ADMIN_ROLE || "superadmin";
  const passwordHash = await bcrypt.hash(password, 10);
  await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash, role },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Database seeded with default catalog data and admin user.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
