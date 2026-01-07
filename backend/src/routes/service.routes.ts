import { Router } from "express";
import {
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getActiveServices
} from "../controllers/service.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * PUBLIC
 */
router.get("/", getActiveServices);

/**
 * ADMIN
 */

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service Management APIs
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/", getActiveServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create service (Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, serviceCode, category, price]
 *             properties:
 *               title:
 *                 type: string
 *               serviceCode:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               pricingType:
 *                 type: string
 *                 example: fixed
 *     responses:
 *       201:
 *         description: Service created
 */
router.post("/", protect, authorize("admin"), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update service (Admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service updated
 */
router.put("/:id", protect, authorize("admin"), updateService);

/**
 * @swagger
 * /api/services/{id}/status:
 *   patch:
 *     summary: Enable or Disable service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 */
router.patch("/:id/status", protect, authorize("admin"), toggleServiceStatus);


router.delete("/:id", protect, authorize("admin"), deleteService);

export default router;
