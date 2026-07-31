import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { getSiteConfig, updateSiteConfig } from "../controllers/siteConfig.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/* ── Site config (public read, admin write) ── */
router.get("/config", getSiteConfig);
router.put("/config", protect, authorize("admin"), updateSiteConfig);

/* PUBLIC */
router.get("/", getProducts);
router.get("/:id", getProductById);

/* ADMIN */
router.post(
  "/create",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 20 }, // 🔥 multiple thumbnails
    { name: "gallery", maxCount: 20 },
    { name: "catalog", maxCount: 1 },
  ]),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 20 },
    { name: "gallery", maxCount: 20 },
    { name: "catalog", maxCount: 1 },
  ]),
  updateProduct
);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
