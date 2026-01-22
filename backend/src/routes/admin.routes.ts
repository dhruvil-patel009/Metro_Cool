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
  getTechnicianStats,
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

router.get(
  "/technicians/stats",
   protect, 
   authorize("admin"), 
   getTechnicianStats
  );

  // ✅ GET PENDING TECHNICIAN REQUESTS
router.get(
  "/technicians/requests",
  protect,
  authorize("admin"),
  getPendingRequests
);

// ✅ GET ALL TECHNICIANS (PAGINATED)
router.get(
  "/technicians",
  protect,
  authorize("admin"),
  getTechnicians
);

//✅ VIEW single technician
router.get(
  "/technicians/:id",
  protect,
  authorize("admin"),
  getTechnicianById
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
