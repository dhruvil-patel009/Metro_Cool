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
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserById,
  getUserStats,
  getUsers,
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



/* ================= USERS ================= */

// GET ALL USERS (PAGINATED)
router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
)

// GET USER STATS
router.get(
  "/users/stats",
  protect,
  authorize("admin"),
  getUserStats
)

// GET SINGLE USER
router.get(
  "/users/:id",
  protect,
  authorize("admin"),
  getUserById
)

// UPDATE USER (name, phone, status)
router.patch(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
)

// TOGGLE USER STATUS (active | inactive | blocked)
router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  toggleUserStatus
)

// DELETE USER
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
)
