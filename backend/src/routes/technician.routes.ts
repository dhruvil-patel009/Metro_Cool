import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { supabase } from "../utils/supabase.js";
import { upload } from "../middlewares/upload.middleware.js";

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

    // Fetch referral code
    const { data: referralCode } = await supabase
      .from("referral_codes")
      .select("code, created_at")
      .eq("technician_id", userId)
      .eq("is_active", true)
      .maybeSingle()

    // Count referrals
    const { count: referralCount } = await supabase
      .from("referral_rewards")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", userId)

    res.json({
      ...profile,
      services:         details?.services || [],
      experience_years: details?.experience_years || null,
      approval_status:  details?.approval_status || "pending",
      tech_status:      details?.status || "inactive",
      referral_code:    referralCode?.code || null,
      total_referrals:  referralCount || 0,
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
    const { first_name, last_name, phone, email } = req.body

    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: "first_name, last_name and phone are required" })
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone must be exactly 10 digits" })
    }

    const updateData: any = { first_name, last_name, phone, updated_at: new Date().toISOString() }
    if (email !== undefined) {
      updateData.email = email
    }

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)

    if (error) throw error

    res.json({ success: true, message: "Profile updated" })
  } catch (err) {
    console.error("Technician profile update error:", err)
    res.status(500).json({ error: "Failed to update profile" })
  }
})

/* ── PUT /api/technician/profile/photo — upload profile photo ── */
router.put("/profile/photo", protect, authorize("technician"), upload.single("profile_photo"), async (req: any, res) => {
  try {
    const userId = req.user.id
    const file = req.file as Express.Multer.File

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const ext = file.originalname.split(".").pop()
    const path = `profiles/${userId}.${ext}`

    // Upload to Supabase storage (upsert replaces existing)
    const { error: uploadError } = await supabase.storage
      .from("secure-documents")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

    if (uploadError) {
      console.error("Photo upload error:", uploadError)
      return res.status(400).json({ error: "Photo upload failed" })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("secure-documents")
      .getPublicUrl(path)

    const profilePhotoUrl = urlData.publicUrl

    // Update profile record
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ profile_photo: profilePhotoUrl, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (dbError) throw dbError

    res.json({ success: true, profile_photo: profilePhotoUrl })
  } catch (err) {
    console.error("Profile photo update error:", err)
    res.status(500).json({ error: "Failed to update profile photo" })
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

/* ── GET /api/technician/notifications — real-time notifications for technician ── */
router.get("/notifications", protect, authorize("technician"), async (req: any, res) => {
  try {
    const technicianId = req.user.id
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Get all bookings assigned to this technician (last 7 days activity)
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        created_at,
        booking_date,
        time_slot,
        job_status,
        full_name,
        total_amount,
        service_id,
        services ( title )
      `)
      .eq("technician_id", technicianId)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20)

    if (bookingsError) throw bookingsError

    // Get open jobs created in last 7 days (new job alerts)
    const { data: openJobs, error: openError } = await supabase
      .from("bookings")
      .select(`
        id,
        created_at,
        booking_date,
        time_slot,
        full_name,
        services ( title )
      `)
      .eq("job_status", "open")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10)

    if (openError) throw openError

    const notifications: any[] = []

    // Notifications from assigned bookings
    for (const b of bookings || []) {
      const serviceName = (b as any).services?.title || "AC Service"
      let title = ""
      let message = ""
      let type = "job"

      switch (b.job_status) {
        case "assigned":
          title = "Job Assigned"
          message = `You have been assigned to ${serviceName} for ${b.full_name}`
          type = "assigned"
          break
        case "on_the_way":
          title = "On The Way"
          message = `You're heading to ${b.full_name} for ${serviceName}`
          type = "in_progress"
          break
        case "working":
          title = "Work Started"
          message = `${serviceName} is in progress for ${b.full_name}`
          type = "in_progress"
          break
        case "completed":
          title = "Job Completed"
          message = `${serviceName} completed. ${b.total_amount ? "₹" + Number(b.total_amount).toLocaleString("en-IN") + " earned" : ""}`
          type = "completed"
          break
        case "report_submitted":
          title = "Report Submitted"
          message = `Service report submitted for ${serviceName}`
          type = "completed"
          break
        default:
          title = "Job Update"
          message = `${serviceName} status updated`
      }

      notifications.push({
        id: `job-${b.id}-${b.job_status}`,
        type,
        title,
        message,
        time: b.created_at,
        read: false,
        booking_id: b.id,
      })
    }

    // Notifications for new available jobs
    for (const j of openJobs || []) {
      const serviceName = (j as any).services?.title || "AC Service"
      notifications.push({
        id: `new-${j.id}`,
        type: "new_job",
        title: "New Job Available",
        message: `${serviceName} requested by ${j.full_name} on ${j.booking_date}`,
        time: j.created_at,
        read: false,
        booking_id: j.id,
      })
    }

    // Sort by time
    notifications.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    )

    res.setHeader("Cache-Control", "no-store")
    res.json({ notifications: notifications.slice(0, 25) })
  } catch (err) {
    console.error("Technician notifications error:", err)
    res.status(500).json({ error: "Failed to load notifications" })
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
