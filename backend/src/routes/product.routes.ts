import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

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

router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.post("/products/create", createProduct);

export default router;
