import { Router } from "express";
import {
	createAdminUserByAdmin,
	deleteAdminUserByEmail,
	getAdminMe,
	listAdminUsers,
	loginAdmin,
	logoutAdmin,
	refreshAdminToken,
	updateAdminUserByEmail,
} from "../controllers/authController.js";
import { requireAdmin, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/auth/login", loginAdmin);
router.post("/auth/refresh", refreshAdminToken);
router.post("/auth/logout", logoutAdmin);
router.get("/auth/me", requireAdmin, getAdminMe);
router.get("/auth/users", requireAdmin, requireRole("superadmin"), listAdminUsers);
router.post("/auth/users", requireAdmin, requireRole("superadmin"), createAdminUserByAdmin);
router.put("/auth/users/:email", requireAdmin, requireRole("superadmin"), updateAdminUserByEmail);
router.delete("/auth/users/:email", requireAdmin, requireRole("superadmin"), deleteAdminUserByEmail);

export default router;
