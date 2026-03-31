import { asyncHandler } from "../middleware/asyncHandler.js";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth.js";
import { AdminUser } from "../models/AdminUser.js";

const publicAdmin = (user) => ({ email: user.email, role: user.role });

const adminListItem = (user) => ({
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const user = await AdminUser.findOne({ email: String(email || "").toLowerCase() });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const tokenPayload = { role: user.role, email: user.email };
  const token = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  res.json({ token, refreshToken, admin: publicAdmin(user) });
});

export const refreshAdminToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    res.status(400);
    throw new Error("refreshToken is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const user = await AdminUser.findOne({ email: decoded.email });
  if (!user || !user.refreshTokenHash) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }

  const tokenPayload = { role: user.role, email: user.email };
  const token = signAccessToken(tokenPayload);
  const newRefreshToken = signRefreshToken(tokenPayload);
  user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
  await user.save();

  res.json({ token, refreshToken: newRefreshToken, admin: publicAdmin(user) });
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.json({ success: true });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await AdminUser.findOne({ email: decoded.email });
    if (user) {
      user.refreshTokenHash = "";
      await user.save();
    }
  } catch {
    // Keep logout idempotent.
  }

  res.json({ success: true });
});

export const getAdminMe = asyncHandler(async (req, res) => {
  const user = await AdminUser.findOne({ email: req.admin?.email });
  if (!user) {
    res.status(404);
    throw new Error("Admin user not found");
  }
  res.json({ admin: publicAdmin(user) });
});

export const listAdminUsers = asyncHandler(async (req, res) => {
  const users = await AdminUser.find().sort({ createdAt: -1 });
  res.json({ users: users.map(adminListItem) });
});

export const createAdminUserByAdmin = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body || {};
  const normalizedEmail = String(email || "").toLowerCase().trim();
  if (!normalizedEmail || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const allowedRole = ["superadmin", "editor"].includes(role) ? role : "editor";
  const exists = await AdminUser.findOne({ email: normalizedEmail });
  if (exists) {
    res.status(409);
    throw new Error("Admin user already exists");
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const created = await AdminUser.create({
    email: normalizedEmail,
    passwordHash,
    role: allowedRole,
  });

  res.status(201).json({ user: adminListItem(created) });
});

export const updateAdminUserByEmail = asyncHandler(async (req, res) => {
  const email = String(req.params.email || "").toLowerCase().trim();
  const { role, password } = req.body || {};
  const user = await AdminUser.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Admin user not found");
  }

  if (role && ["superadmin", "editor"].includes(role)) {
    user.role = role;
  }
  if (password) {
    user.passwordHash = await bcrypt.hash(String(password), 10);
    user.refreshTokenHash = "";
  }

  await user.save();
  res.json({ user: adminListItem(user) });
});

export const deleteAdminUserByEmail = asyncHandler(async (req, res) => {
  const email = String(req.params.email || "").toLowerCase().trim();
  if (req.admin?.email === email) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  const user = await AdminUser.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Admin user not found");
  }

  if (user.role === "superadmin") {
    const superadmins = await AdminUser.countDocuments({ role: "superadmin" });
    if (superadmins <= 1) {
      res.status(400);
      throw new Error("At least one superadmin must remain");
    }
  }

  await user.deleteOne();
  res.json({ success: true });
});
