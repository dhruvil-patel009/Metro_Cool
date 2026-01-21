import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  approveTechnician,
  rejectTechnician,
  deactivateTechnician,
  getTechnicians,
  getPendingRequests,
  updateTechnician,
  getTechnicianById,
  deleteTechnician,
} from "../controllers/admin.controller.js";

const router = Router();

/* ================= ADMIN DASHBOARD ================= */

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Admin dashboard access granted" });
  }
);

/* ================= TECHNICIANS ================= */

// ✅ GET ALL TECHNICIANS (PAGINATED)
router.get(
  "/technicians",
  protect,
  authorize("admin"),
  getTechnicians
);

// ✅ GET PENDING TECHNICIAN REQUESTS
router.get(
  "/technicians/requests",
  protect,
  authorize("admin"),
  getPendingRequests
);

// ✅ APPROVE TECHNICIAN
router.patch(
  "/technicians/:id/approve",
  protect,
  authorize("admin"),
  approveTechnician
);

// ✅ REJECT TECHNICIAN
router.patch(
  "/technicians/:id/reject",
  protect,
  authorize("admin"),
  rejectTechnician
);

// ✅ DEACTIVATE TECHNICIAN
router.patch(
  "/technicians/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateTechnician
);

// VIEW single technician
router.get(
  "/technicians/:id",
  protect,
  authorize("admin"),
  getTechnicianById
);

// UPDATE technician
router.patch(
  "/technicians/:id",
  protect,
  authorize("admin"),
  updateTechnician
);

// DELETE technician
router.delete(
  "/technicians/:id",
  protect,
  authorize("admin"),
  deleteTechnician
);

export default router;
