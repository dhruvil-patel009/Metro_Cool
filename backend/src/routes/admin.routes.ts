import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getAdminNotifications, getNotificationPreferences, updateNotificationPreferences } from "../controllers/notifications.controller.js";
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
  getAdminProfile,
  updateAdminProfile,
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
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

/* ================= NOTIFICATIONS ================= */
router.get("/notifications", protect, authorize("admin"), getAdminNotifications);
router.get("/notification-preferences", protect, authorize("admin"), getNotificationPreferences);
router.put("/notification-preferences", protect, authorize("admin"), updateNotificationPreferences);

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

/* ================= USERS ================= */

router.get("/users", protect, authorize("admin"), getUsers)
router.get("/users/stats", protect, authorize("admin"), getUserStats)
router.get("/users/:id", protect, authorize("admin"), getUserById)
router.patch("/users/:id", protect, authorize("admin"), updateUser)
router.patch("/users/:id/status", protect, authorize("admin"), toggleUserStatus)
router.delete("/users/:id", protect, authorize("admin"), deleteUser)

/* ================= ADMIN PROFILE ================= */

router.get("/profile", protect, authorize("admin"), getAdminProfile)
router.put("/profile", protect, authorize("admin"), updateAdminProfile)
router.get("/admins", protect, authorize("admin"), getAdmins)
router.post("/create", protect, authorize("admin"), createAdmin)
router.patch("/admins/:adminId", protect, authorize("admin"), updateAdmin)
router.patch("/admins/:adminId/status", protect, authorize("admin"), toggleAdminStatus)
router.delete("/admins/:adminId", protect, authorize("admin"), deleteAdmin)

export default router;