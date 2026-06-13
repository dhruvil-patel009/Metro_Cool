import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { supabase } from "../utils/supabase.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("technician"),
  (req, res) => {
    res.json({ message: "Technician dashboard access granted" });
  }
);

/* ── GET /api/technician/profile — authenticated technician's own profile ── */
router.get("/profile", protect, authorize("technician"), async (req: any, res) => {
  try {
    const userId = req.user.id

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, phone, email, profile_photo, role, created_at")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    // Fetch technician details (services, experience)
    const { data: details } = await supabase
      .from("technician_details")
      .select("services, experience_years, approval_status, status")
      .eq("id", userId)
      .maybeSingle()

    res.json({
      ...profile,
      services:         details?.services || [],
      experience_years: details?.experience_years || null,
      approval_status:  details?.approval_status || "pending",
      tech_status:      details?.status || "inactive",
    })
  } catch (err) {
    console.error("Technician profile error:", err)
    res.status(500).json({ error: "Failed to load profile" })
  }
})

/* ── PUT /api/technician/profile — update own profile ── */
router.put("/profile", protect, authorize("technician"), async (req: any, res) => {
  try {
    const userId = req.user.id
    const { first_name, last_name, phone } = req.body

    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: "first_name, last_name and phone are required" })
    }

    const { error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, phone, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) throw error

    res.json({ success: true, message: "Profile updated" })
  } catch (err) {
    console.error("Technician profile update error:", err)
    res.status(500).json({ error: "Failed to update profile" })
  }
})

/* ── GET /api/technician/earnings — technician's completed jobs with amounts ── */
router.get("/earnings", protect, authorize("technician"), async (req: any, res) => {
  try {
    const technicianId = req.user.id

    const { data, error } = await supabase
      .from("bookings")
      .select("id, booking_date, job_status, total_amount, full_name, services(title)")
      .eq("technician_id", technicianId)
      .eq("job_status", "completed")
      .order("booking_date", { ascending: false })

    if (error) throw error

    res.setHeader("Cache-Control", "no-store")
    res.json({ bookings: data || [] })
  } catch (err) {
    console.error("Technician earnings error:", err)
    res.status(500).json({ error: "Failed to load earnings" })
  }
})

/* ── GET /api/technician/stats — counts for dashboard cards ── */
router.get("/stats", protect, authorize("technician"), async (req: any, res) => {
  try {
    const technicianId = req.user.id

    const { data, error } = await supabase
      .from("bookings")
      .select("id, job_status, total_amount, booking_date")
      .eq("technician_id", technicianId)

    if (error) throw error

    const bookings = data || []
    const completed = bookings.filter(b => b.job_status === "completed")
    const pending   = bookings.filter(b => ["assigned", "on_the_way", "working"].includes(b.job_status))
    const today     = new Date().toLocaleDateString("en-CA")
    const todayJobs = bookings.filter(b => b.booking_date === today)
    const totalEarned = completed.reduce((s, b) => s + Number(b.total_amount || 0), 0)

    res.json({
      completed: completed.length,
      pending:   pending.length,
      today:     todayJobs.length,
      totalEarned,
    })
  } catch (err) {
    console.error("Technician stats error:", err)
    res.status(500).json({ error: "Failed to load stats" })
  }
})

/* ── GET all technicians (public list for service pages) ── */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, middle_name, last_name, profile_photo")
    .eq("role", "technician")

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const technicians = data.map((t) => ({
    id: t.id,
    name: [t.first_name, t.middle_name, t.last_name].filter(Boolean).join(" "),
    role: "AC Technician",
    photo_url: t.profile_photo || null,
  }))

  res.json(technicians)
})

export default router;
