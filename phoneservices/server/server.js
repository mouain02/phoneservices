import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { connectDb } from "./config/db.js";
import { ensureAdminUser } from "./config/ensureAdminUser.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = String(process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wildcardToRegex = (originPattern) => {
  if (!originPattern.includes("*")) return new RegExp(`^${escapeRegex(originPattern)}$`);
  const regexPattern = originPattern.split("*").map(escapeRegex).join(".*");
  return new RegExp(`^${regexPattern}$`);
};
const allowedOriginRegexList = allowedOrigins.map(wildcardToRegex);
const isAllowedOrigin = (origin) => allowedOriginRegexList.some((regex) => regex.test(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients and same-origin requests without Origin header.
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
  })
);
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`API server running on port ${port}`);
});

const initDataLayer = async () => {
  try {
    await connectDb();
    const adminSeed = await ensureAdminUser();
    if (adminSeed.action === "created") {
      console.log(`Seeded admin user ${adminSeed.email} (${adminSeed.role})`);
    }
  } catch (err) {
    console.error("Data layer initialization failed", err);
  }
};

initDataLayer();
