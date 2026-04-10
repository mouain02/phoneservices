import bcrypt from "bcryptjs";
import { AdminUser } from "../models/AdminUser.js";

const getAdminSeed = () => ({
  email: (process.env.ADMIN_EMAIL || "admin@phoneservices.local").toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "admin123",
  role: process.env.ADMIN_ROLE || "superadmin",
});

export const ensureAdminUser = async ({ resetPassword = false } = {}) => {
  const { email, password, role } = getAdminSeed();
  const existing = await AdminUser.findOne({ email });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await AdminUser.create({ email, passwordHash, role });
    return { action: "created", email, role };
  }

  if (resetPassword) {
    existing.passwordHash = await bcrypt.hash(password, 10);
    existing.role = role;
    await existing.save();
    return { action: "updated", email, role };
  }

  return { action: "kept", email, role: existing.role };
};
