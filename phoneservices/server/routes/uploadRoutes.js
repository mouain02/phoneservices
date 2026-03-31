import { Router } from "express";
import { uploadImage } from "../api/uploadController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/uploads/image", requireAdmin, uploadImage);

export default router;
