import { Router } from "express";
import {
  createBrand,
  createCarouselSlide,
  createCustomerFeedback,
  createDeviceType,
  createModel,
  deleteBrandById,
  deleteCarouselSlideById,
  deleteCustomerFeedbackById,
  deleteDeviceTypeById,
  deleteModelById,
  getCatalog,
  getSiteContent,
  importCatalog,
  resetCatalog,
  resetSiteContent,
  updateBrandById,
  updateCarouselSlideById,
  updateCustomerFeedbackById,
  updateDeviceTypeById,
  updateModelById,
} from "../api/catalogController.js";
import { requireAdmin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/catalog", getCatalog);
router.get("/site-content", getSiteContent);
router.post("/catalog/import", requireAdmin, requireRole("superadmin"), importCatalog);
router.post("/catalog/reset", requireAdmin, requireRole("superadmin"), resetCatalog);
router.post("/site-content/reset", requireAdmin, requireRole("superadmin"), resetSiteContent);

router.post("/device-types", requireAdmin, requireRole("superadmin", "editor"), createDeviceType);
router.put("/device-types/:id", requireAdmin, requireRole("superadmin", "editor"), updateDeviceTypeById);
router.delete("/device-types/:id", requireAdmin, requireRole("superadmin"), deleteDeviceTypeById);

router.post("/brands", requireAdmin, requireRole("superadmin", "editor"), createBrand);
router.put("/brands/:id", requireAdmin, requireRole("superadmin", "editor"), updateBrandById);
router.delete("/brands/:id", requireAdmin, requireRole("superadmin"), deleteBrandById);

router.post("/models", requireAdmin, requireRole("superadmin", "editor"), createModel);
router.put("/models/:id", requireAdmin, requireRole("superadmin", "editor"), updateModelById);
router.delete("/models/:id", requireAdmin, requireRole("superadmin"), deleteModelById);

router.post("/site-content/carousel", requireAdmin, requireRole("superadmin", "editor"), createCarouselSlide);
router.put("/site-content/carousel/:id", requireAdmin, requireRole("superadmin", "editor"), updateCarouselSlideById);
router.delete("/site-content/carousel/:id", requireAdmin, requireRole("superadmin", "editor"), deleteCarouselSlideById);

router.post("/site-content/feedback", requireAdmin, requireRole("superadmin", "editor"), createCustomerFeedback);
router.put("/site-content/feedback/:id", requireAdmin, requireRole("superadmin", "editor"), updateCustomerFeedbackById);
router.delete("/site-content/feedback/:id", requireAdmin, requireRole("superadmin", "editor"), deleteCustomerFeedbackById);

export default router;
