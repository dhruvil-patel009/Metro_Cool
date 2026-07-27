import { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { supabase } from "../utils/supabase.js"
import { sendPush } from "../utils/push.js"
import { transporter } from "../utils/mailer.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const templatesDir = path.resolve(__dirname, "../../templates")

/* ── Load + fill an email template ── */
function fillTemplate(fileName: string, vars: Record<string, string>): string {
  const filePath = path.join(templatesDir, fileName)
  let html = fs.readFileSync(filePath, "utf-8")
  for (const [k, v] of Object.entries(vars)) {
    html = html.replaceAll(`{{${k}}}`, v)
  }
  return html
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
}

function formatCurrency(amount: number): string {
  return `\u20B9${Number(amount).toLocaleString("en-IN")}`
}

/* ======================================================
   📊 GET WEEKLY BOOKING STATS (Chart data)
   Returns per-day booking counts for the last 7 days
   ====================================================== */

export const getWeeklyBookingStats = async (req: Request, res: Response) => {
  try {
    res.setHeader("Cache-Control", "no-store")

    // Build date range: today (IST) back 6 days
    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toLocaleDateString("en-CA")) // "YYYY-MM-DD" in local time
    }

    const from = days[0]
    const to = days[days.length - 1]

    // Single query — fetch all bookings in date range
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_date")
      .gte("booking_date", from)
      .lte("booking_date", to)

    if (error) throw error

    // Count per day
    const counts: Record<string, number> = {}
    days.forEach(d => { counts[d] = 0 })
    ;(data || []).forEach(b => {
      const key = String(b.booking_date).slice(0, 10)
      if (counts[key] !== undefined) counts[key]++
    })

    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const chartData = days.map(dateStr => ({
      date: dateStr,
      day: DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()],
      count: counts[dateStr],
    }))

    const total = chartData.reduce((s, d) => s + d.count, 0)

    res.json({ chartData, total })
  } catch (err) {
    console.error("Weekly stats error:", err)
    res.status(500).json({ error: "Failed to fetch weekly stats" })
  }
}

/* ======================================================
   💰 GET WEEKLY REVENUE STATS (Chart data)
   Returns per-day revenue from completed bookings
   ====================================================== */

export const getWeeklyRevenueStats = async (_req: Request, res: Response) => {
  try {
    res.setHeader("Cache-Control", "no-store")

    const days: string[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(d.toLocaleDateString("en-CA"))
    }

    const from = days[0]
    const to = days[days.length - 1]

    const { data, error } = await supabase
      .from("bookings")
      .select("booking_date, total_amount")
      .eq("job_status", "completed")
      .gte("booking_date", from)
      .lte("booking_date", to)

    if (error) throw error

    const revenue: Record<string, number> = {}
    days.forEach(d => { revenue[d] = 0 })
    ;(data || []).forEach(b => {
      const key = String(b.booking_date).slice(0, 10)
      if (revenue[key] !== undefined) {
        revenue[key] += Number(b.total_amount || 0)
      }
    })

    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const chartData = days.map(dateStr => ({
      date: dateStr,
      day: DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()],
      value: revenue[dateStr],
    }))

    const total = chartData.reduce((s, d) => s + d.value, 0)

    res.json({ chartData, total })
  } catch (err) {
    console.error("Weekly revenue stats error:", err)
    res.status(500).json({ error: "Failed to fetch weekly revenue stats" })
  }
}

export const getBookingStats = async (req: Request, res: Response) => {
  try {
    // 🔥 Disable caching
    res.setHeader("Cache-Control", "no-store")

    // ✅ Correct local date for Postgres DATE
    const today = new Date().toLocaleDateString("en-CA")

    // 📅 Today's bookings
    const { count: todayCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("booking_date", today)

    // ⏳ Pending approval
    const { count: pendingCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // ✅ Completed
    const { count: completedCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    // 💰 Total revenue
    const { data: revenueRows } = await supabase
      .from("bookings")
      .select("total_amount")
      .eq("status", "completed")

    const revenue =
      revenueRows?.reduce(
        (sum, r) => sum + Number(r.total_amount || 0),
        0
      ) || 0

    res.json({
      today: todayCount || 0,
      pending: pendingCount || 0,
      completed: completedCount || 0,
      revenue,
    })
  } catch (error) {
    console.error("Booking stats error:", error)
    res.status(500).json({ error: "Failed to fetch booking stats" })
  }
}


/* ======================================================
   📋 GET BOOKINGS LIST (Table)
   ====================================================== */

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        booking_date,
        time_slot,
        job_status,
        full_name,
        phone,
        total_amount
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw error

    // 🔄 Map DB → UI shape
    const formatted = data.map((b) => ({
      id: `#BK-${b.id.slice(0, 6)}`,
      user: {
        name: b.full_name,
        avatar: "/placeholder.svg",
        type: "Customer",
      },
      technician: {
        name: "Not Assigned",
        initials: "NA",
        color: "bg-gray-400",
      },
      service: "Service",
      date: b.booking_date,
      time: b.time_slot,
      status:
        b.job_status === "open"
          ? "Open"
          : b.job_status === "assigned"
          ? "Assigned"
          : b.job_status === "on_the_way"
          ? "On the Way"
          : b.job_status === "working"
          ? "Working"
          : b.job_status === "completed"
          ? "Completed"
          : b.job_status === "cancelled"
          ? "Cancelled"
          : "Confirmed",
      payment: b.job_status === "completed" ? "Paid" : "Unpaid",
    }))

    res.json({
      data: formatted,
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
}



/* ======================================================
   ❌ CANCEL BOOKING (Admin)
   Sets job_status = 'cancelled' with a reason
   ====================================================== */

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { cancellation_reason } = req.body

    if (!cancellation_reason) {
      return res.status(400).json({ error: "Cancellation reason is required" })
    }

    // Check booking exists and is not already completed/cancelled
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, job_status")
      .eq("id", id)
      .maybeSingle()

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (existing.job_status === "completed") {
      return res.status(400).json({ error: "Cannot cancel a completed booking" })
    }

    if (existing.job_status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" })
    }

    // Update booking
    const { data, error } = await supabase
      .from("bookings")
      .update({
        job_status: "cancelled",
        cancellation_reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: "admin",
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, message: "Booking cancelled successfully", booking: data })
  } catch (err) {
    console.error("Cancel booking error:", err)
    res.status(500).json({ error: "Failed to cancel booking" })
  }
}

/* ================= HELPER ================= */

const normalizeStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending"
    case "completed":
      return "Completed"
    case "cancelled":
      return "Cancelled"
    case "in_progress":
      return "In Progress"
    default:
      return "Confirmed"
  }
}

/* ================= GET BOOKINGS ================= */

export const getAdminBookings = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 6)
    const from = (page - 1) * limit
    const to = from + limit - 1

    /* 1️⃣ Fetch bookings + profiles */
    const { data: bookingsRaw, error, count } = await supabase
      .from("bookings")
      .select(
        `
        id,
        service_id,
        booking_date,
        time_slot,
        job_status,
        total_amount,
        created_at,

        profile:profiles!bookings_user_id_fkey (
          first_name,
          last_name,
          profile_photo,
          role
        )
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) throw error

    /* 2️⃣ Collect service IDs */
    const serviceIds = (bookingsRaw || [])
      .map((b: any) => b.service_id)
      .filter(Boolean)

    /* 3️⃣ Fetch services */
    const { data: services } = await supabase
      .from("services")
      .select("id, title")
      .in("id", serviceIds)

    /* 4️⃣ Build service lookup */
    const serviceMap = new Map(
      (services || []).map((s: any) => [s.id, s.title])
    )

    /* 5️⃣ Final response mapping */
    const bookings = (bookingsRaw || []).map((b: any) => ({
      id: b.id,
      service: serviceMap.get(b.service_id) || "Service",
      date: b.booking_date,
      time: b.time_slot,
      status:
        b.job_status === "open" ? "Open"
        : b.job_status === "assigned" ? "Assigned"
        : b.job_status === "on_the_way" ? "On the Way"
        : b.job_status === "working" ? "Working"
        : b.job_status === "completed" ? "Completed"
        : b.job_status === "cancelled" ? "Cancelled"
        : "Confirmed",
      payment: b.job_status === "completed" ? "Paid" : "Unpaid",

      user: {
        name:
          `${b.profile?.first_name ?? ""} ${b.profile?.last_name ?? ""}`.trim() ||
          "Unknown",
        avatar: b.profile?.profile_photo || null,
        type: b.profile?.role || "user",
      },

      technician: {
        name: "Unassigned",
        initials: "NA",
        color: "bg-gray-400",
      },
    }))

    res.json({
      data: bookings,
      total: count ?? 0,
    })
  } catch (err) {
    console.error("Admin bookings error:", err)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
}

/* ======================================================
   🔄 REASSIGN TECHNICIAN (Admin)
   Reassigns a booking to a different technician,
   then sends a push notification + email to the new technician.
   ====================================================== */
export const reassignTechnician = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { technician_id } = req.body

    if (!technician_id) {
      return res.status(400).json({ error: "technician_id is required" })
    }

    // ── 1. Verify booking exists and is reassignable ──
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, job_status, technician_id, booking_date, time_slot, full_name, phone, address, total_amount, service_id, booking_ref")
      .eq("id", id)
      .maybeSingle()

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (existing.job_status === "completed") {
      return res.status(400).json({ error: "Cannot reassign a completed booking" })
    }

    if (existing.job_status === "cancelled") {
      return res.status(400).json({ error: "Cannot reassign a cancelled booking" })
    }

    // ── 2. Verify technician exists and fetch their profile + email ──
    const { data: tech, error: techError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, phone")
      .eq("id", technician_id)
      .eq("role", "technician")
      .maybeSingle()

    if (techError || !tech) {
      return res.status(404).json({ error: "Technician not found" })
    }

    // ── 3. Fetch service name ──
    let serviceName = "AC Service"
    if (existing.service_id) {
      const { data: svc } = await supabase
        .from("services")
        .select("title")
        .eq("id", existing.service_id)
        .maybeSingle()
      if (svc?.title) serviceName = svc.title
    }

    // ── 4. Do the reassignment ──
    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        technician_id,
        job_status: "assigned",
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("Supabase reassign error:", JSON.stringify(updateError))
      throw updateError
    }

    // ── 5. Respond immediately — notifications are fire-and-forget ──
    res.json({
      success: true,
      message: `Booking reassigned to ${tech.first_name} ${tech.last_name}`,
      booking,
    })

    // ── 6. Send push notification to the new technician ──
    const bookingRef = existing.booking_ref || `#${id.slice(0, 8).toUpperCase()}`

    try {
      const { data: pushRow } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", technician_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (pushRow?.endpoint) {
        // Reconstruct the web-push subscription object from stored columns
        const subscription = {
          endpoint: pushRow.endpoint,
          keys: { p256dh: pushRow.p256dh, auth: pushRow.auth },
        }

        await sendPush(subscription, {
          title: "New Job Assigned 🔧",
          body: `${serviceName} on ${formatDate(existing.booking_date)} · ${existing.time_slot || "TBD"}`,
          url: "https://www.metro-cool.com/technician/jobs",
          bookingRef,
        })
        console.log(`[reassign] Push sent to technician ${technician_id} ✅`)
      } else {
        console.log(`[reassign] No push subscription for technician ${technician_id} — skipping push`)
      }
    } catch (pushErr) {
      console.error("[reassign] Push notification failed (non-fatal):", pushErr)
    }

    // ── 7. Send email to the new technician ──
    if (tech.email) {
      try {
        const html = fillTemplate("technician-reassigned.html", {
          techName: `${tech.first_name} ${tech.last_name}`.trim(),
          bookingRef,
          serviceName,
          bookingDate: formatDate(existing.booking_date),
          timeSlot: existing.time_slot || "To be confirmed",
          customerAddress: existing.address || "See app for details",
          customerName: existing.full_name || "Customer",
          customerPhone: existing.phone || "N/A",
          totalAmount: formatCurrency(Number(existing.total_amount || 0)),
        })

        await transporter.sendMail({
          from: `"Metro Cool" <${process.env.MAIL_USER}>`,
          to: tech.email,
          subject: `[JOB] New Assignment — ${serviceName} on ${formatDate(existing.booking_date)} | Metro Cool`,
          html,
        })
        console.log(`[reassign] Email sent to technician ${tech.email} ✅`)
      } catch (mailErr) {
        console.error("[reassign] Email failed (non-fatal):", mailErr)
      }
    } else {
      console.log(`[reassign] Technician has no email — skipping email`)
    }

  } catch (err: any) {
    console.error("Reassign technician error:", err?.message ?? err)
    res.status(500).json({ error: err?.message || "Failed to reassign technician" })
  }
}
