import { Router } from "express";
import {
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getActiveServices,
  getAllServicesAdmin,
  getServiceById,

  likeService,
  getServiceDetailsPublic,
  getPublicServiceById,
  getFullServiceDetails,
} from "../controllers/service.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * PUBLIC
 */
router.get("/", getActiveServices);
router.get("/public/:id", getPublicServiceById); // ✅ ADD THIS


// service details page
router.get("/:id/details", getServiceDetailsPublic);

router.get("/:id/full-details", getFullServiceDetails);

// like ❤️
router.post("/:id/like", protect, likeService);

/**
 * ADMIN
 */
router.get("/admin", protect, authorize("admin"), getAllServicesAdmin);
router.get("/:id", protect, authorize("admin"), getServiceById);

router.post("/", protect, authorize("admin"),upload.none(), createService);
router.put("/:id", protect, authorize("admin"), updateService);
router.patch("/:id/status", protect, authorize("admin"), toggleServiceStatus);
router.delete("/:id", protect, authorize("admin"), deleteService);

export default router;
