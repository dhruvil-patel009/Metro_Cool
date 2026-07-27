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
import { supabase } from "../utils/supabase.js";

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

/* ================= REFERRAL REPAIR ================= */
/**
 * POST /api/admin/repair-referral-rewards
 *
 * Scans ALL technicians who registered with a promo_code in technician_details.
 * For each one, checks whether a referral_rewards row already exists.
 * If it's missing, creates it. If it exists with old status values, normalises them.
 *
 * Safe to run multiple times — it is fully idempotent.
 */
router.post("/repair-referral-rewards", protect, authorize("admin"), async (_req, res) => {
  try {
    // 1. Get all technicians who used a promo code
    const { data: techsWithPromo, error: techErr } = await supabase
      .from("technician_details")
      .select("id, promo_code")
      .not("promo_code", "is", null)

    if (techErr) return res.status(500).json({ error: techErr.message })

    const created: string[] = []
    const normalised: string[] = []
    const skipped: string[] = []

    for (const tech of techsWithPromo || []) {
      if (!tech.promo_code) continue

      // Look up the referral code record
      const { data: codeRow } = await supabase
        .from("referral_codes")
        .select("id, technician_id")
        .eq("code", tech.promo_code.toUpperCase().trim())
        .maybeSingle()

      if (!codeRow) {
        skipped.push(`${tech.id}: code ${tech.promo_code} not found`)
        continue
      }

      if (codeRow.technician_id === tech.id) {
        skipped.push(`${tech.id}: self-referral, skipped`)
        continue
      }

      // Check if a reward row already exists for this referred technician
      const { data: existing } = await supabase
        .from("referral_rewards")
        .select("id, reward_status, reward_type, reward_value")
        .eq("referred_id", tech.id)
        .maybeSingle()

      if (!existing) {
        // Row is completely missing — create it
        const { error: insertErr } = await supabase
          .from("referral_rewards")
          .insert({
            referrer_id: codeRow.technician_id,
            referred_id: tech.id,
            referral_code_id: codeRow.id,
            reward_type: "cash_credit",
            reward_value: 400,
            reward_status: "pending",
            jobs_remaining: 3,
          })

        if (insertErr) {
          // DB constraint rejects new values — fall back to legacy
          const { error: fbErr } = await supabase
            .from("referral_rewards")
            .insert({
              referrer_id: codeRow.technician_id,
              referred_id: tech.id,
              referral_code_id: codeRow.id,
              reward_type: "commission_discount",
              reward_value: 5,
              reward_status: "active",
              jobs_remaining: 3,
            })
          if (fbErr) {
            skipped.push(`${tech.id}: insert failed — ${fbErr.message}`)
          } else {
            created.push(`${tech.id} (legacy values)`)
          }
        } else {
          created.push(tech.id)
        }
      } else {
        // Row exists — normalise status if needed
        const needsFix =
          existing.reward_status === "active" ||
          existing.reward_status === "used"

        if (needsFix) {
          const newStatus = existing.reward_status === "used" ? "credited" : "pending"
          await supabase
            .from("referral_rewards")
            .update({ reward_status: newStatus, referrer_id: codeRow.technician_id })
            .eq("id", existing.id)
          normalised.push(tech.id)
        } else {
          skipped.push(`${tech.id}: already correct`)
        }
      }
    }

    res.json({
      success: true,
      created,
      normalised,
      skipped,
      summary: `Created ${created.length}, normalised ${normalised.length}, skipped ${skipped.length}`,
    })
  } catch (err) {
    console.error("Repair referral rewards error:", err)
    res.status(500).json({ error: "Repair failed" })
  }
})

/* ================= REFERRAL JOB BACKFILL ================= */
/**
 * POST /api/admin/backfill-referral-jobs
 *
 * For every pending referral_reward, counts how many completed jobs
 * the referred technician actually has, and corrects jobs_remaining.
 *
 * Use this when a job was completed BEFORE the reward row was created
 * (e.g. ABC DSD completed 1 job before migration inserted their row).
 */
router.post("/backfill-referral-jobs", protect, authorize("admin"), async (_req, res) => {
  try {
    // Get all pending reward rows
    const { data: pendingRewards, error } = await supabase
      .from("referral_rewards")
      .select("id, referred_id, jobs_remaining")
      .in("reward_status", ["pending", "active"])

    if (error) return res.status(500).json({ error: error.message })

    const updated: any[] = []

    for (const reward of pendingRewards || []) {
      // Count how many jobs this referred technician has actually completed
      const { count } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("technician_id", reward.referred_id)
        .eq("job_status", "completed")

      const completedJobs = count ?? 0
      const correctRemaining = Math.max(0, 3 - completedJobs)

      if (correctRemaining !== reward.jobs_remaining) {
        if (correctRemaining === 0) {
          // All 3 done — mark as credited
          await supabase
            .from("referral_rewards")
            .update({ jobs_remaining: 0, reward_status: "credited" })
            .eq("id", reward.id)
          updated.push({ id: reward.id, referred_id: reward.referred_id, completedJobs, action: "credited" })
        } else {
          await supabase
            .from("referral_rewards")
            .update({ jobs_remaining: correctRemaining })
            .eq("id", reward.id)
          updated.push({ id: reward.id, referred_id: reward.referred_id, completedJobs, jobsRemaining: correctRemaining, action: "corrected" })
        }
      }
    }

    res.json({
      success: true,
      updated,
      summary: `Checked ${pendingRewards?.length ?? 0} rewards, corrected ${updated.length}`,
    })
  } catch (err) {
    console.error("Backfill referral jobs error:", err)
    res.status(500).json({ error: "Backfill failed" })
  }
})

export default router;
