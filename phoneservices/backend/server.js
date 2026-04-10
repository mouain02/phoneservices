import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import net from "node:net";
import { connectDb } from "./config/db.js";
import { ensureAdminUser } from "./config/ensureAdminUser.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { createApiRateLimiter, securityHeadersMiddleware } from "./middleware/security.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === "production";
const trustProxy = process.env.TRUST_PROXY === "true";
const requestBodyLimit = process.env.REQUEST_BODY_LIMIT || "15mb";
const rateWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const rateLimitMax = Number(
  process.env.RATE_LIMIT_MAX || (isProduction ? 120 : 1000)
);

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

app.disable("x-powered-by");
app.set("trust proxy", trustProxy);
app.use(securityHeadersMiddleware({ isProduction, allowedOrigins }));

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
app.use(express.json({ limit: requestBodyLimit }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use(
  "/api",
  createApiRateLimiter({
    windowMs: rateWindowMs,
    max: rateLimitMax,
    skip: (req) => req.path === "/health",
  })
);

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const isPortAvailable = (candidatePort) =>
  new Promise((resolve) => {
    const tester = net.createServer();

    tester.once("error", () => resolve(false));
    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });

    tester.listen(candidatePort, "0.0.0.0");
  });

const findAvailablePort = async (startPort) => {
  if (isProduction) return startPort;

  let candidatePort = startPort;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    // Prefer the configured port, but fall back to the next free port if needed.
    if (await isPortAvailable(candidatePort)) {
      return candidatePort;
    }
    candidatePort += 1;
  }

  return startPort;
};

const initDataLayer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is missing; starting API without database connectivity.");
      return;
    }

    await connectDb();
    const adminSeed = await ensureAdminUser();
    if (adminSeed.action === "created" && !isProduction) {
      console.log(`Seeded admin user ${adminSeed.email} (${adminSeed.role})`);
    }
  } catch (err) {
    console.error("Data layer initialization failed", err);
  }
};

const resolvedPort = await findAvailablePort(port);

app.listen(resolvedPort, "0.0.0.0", () => {
  if (resolvedPort !== port && !isProduction) {
    console.warn(`Port ${port} was busy; listening on ${resolvedPort} instead.`);
  }
  console.log(`API server running on port ${resolvedPort}`);
});

initDataLayer();
