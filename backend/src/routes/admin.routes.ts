import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  approveTechnician,
  rejectTechnician,
  deactivateTechnician,
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

// ✅ GET all technicians (pagination)
// router.get(
//   "/technicians",
//   protect,
//   authorize("admin"),
//   getTechnicians
// );

// // ✅ GET pending technician requests
// router.get(
//   "/technicians/requests",
//   protect,
//   authorize("admin"),
//   getPendingRequests
// );

// ✅ APPROVE technician
router.patch(
  "/technicians/:id/approve",
  protect,
  authorize("admin"),
  approveTechnician
);

// ✅ REJECT technician
router.patch(
  "/technicians/:id/reject",
  protect,
  authorize("admin"),
  rejectTechnician
);

// ✅ DEACTIVATE technician
router.patch(
  "/technicians/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateTechnician
);

export default router;
