import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

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
      status: normalizeStatus(b.status),
      payment: b.total_amount ? "Paid" : "Unpaid",

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
