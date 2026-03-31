import jwt from "jsonwebtoken";

const getAccessSecret = () => process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

export const signAccessToken = (payload) => {
  const secret = getAccessSecret();
  if (!secret) throw new Error("JWT_SECRET is missing");
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" });
};

export const signRefreshToken = (payload) => {
  const secret = getRefreshSecret();
  if (!secret) throw new Error("JWT_REFRESH_SECRET/JWT_SECRET is missing");
  return jwt.sign(payload, secret, { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" });
};

export const verifyRefreshToken = (token) => jwt.verify(token, getRefreshSecret());

export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, getAccessSecret());
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin?.role) {
    return res.status(403).json({ message: "Role missing" });
  }
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
};
