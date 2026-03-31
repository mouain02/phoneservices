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

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:8080" }));
app.use(express.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "server", "uploads")));

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDb();
  const adminSeed = await ensureAdminUser();
  if (adminSeed.action === "created") {
    console.log(`Seeded admin user ${adminSeed.email} (${adminSeed.role})`);
  }
  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
