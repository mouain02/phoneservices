import { asyncHandler } from "../middleware/asyncHandler.js";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.resolve(process.cwd(), "server", "uploads");

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

const sanitizeFolder = (folder) => {
  const raw = String(folder || "phoneservices");
  const segments = raw
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9_-]/g, "-"));

  return segments.length > 0 ? segments : ["phoneservices"];
};

const parseDataUrl = (dataUrl) => {
  const [meta, payload] = String(dataUrl).split(",", 2);
  if (!meta || !payload || !meta.startsWith("data:")) return null;

  const mime = meta.slice(5).split(";")[0].trim().toLowerCase();
  const isBase64 = /;base64$/i.test(meta);
  if (!isBase64) return null;

  return {
    mime,
    buffer: Buffer.from(payload, "base64"),
  };
};

export const uploadImage = asyncHandler(async (req, res) => {
  const { dataUrl, folder } = req.body || {};

  if (!dataUrl || typeof dataUrl !== "string") {
    res.status(400);
    throw new Error("dataUrl is required");
  }

  const parsed = parseDataUrl(dataUrl);
  if (!parsed || !parsed.mime.startsWith("image/")) {
    res.status(400);
    throw new Error("Invalid image dataUrl");
  }

  const ext = EXT_BY_MIME[parsed.mime];
  if (!ext) {
    res.status(400);
    throw new Error("Unsupported image format");
  }

  const safeSegments = sanitizeFolder(folder);
  const targetDir = path.join(UPLOAD_ROOT, ...safeSegments);
  await mkdir(targetDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const fullPath = path.join(targetDir, fileName);
  await writeFile(fullPath, parsed.buffer);

  const publicPath = ["uploads", ...safeSegments, fileName].join("/");
  const imageUrl = `${req.protocol}://${req.get("host")}/${publicPath}`;

  res.status(201).json({ imageUrl });
});
