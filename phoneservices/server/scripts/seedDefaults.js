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
} from "../../src/components/data/phones.js";

const seed = async () => {
  await connectDb();

  await Promise.all([
    DeviceType.deleteMany({}),
    Brand.deleteMany({}),
    Model.deleteMany({}),
  ]);

  await DeviceType.insertMany(defaultDeviceTypes, { ordered: false });
  await Brand.insertMany(defaultBrands, { ordered: false });
  await Model.insertMany(defaultModels, { ordered: false });

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
