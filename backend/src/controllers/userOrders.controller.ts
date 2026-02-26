import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

export const getUserOrderHistory = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id

    /* ---------------- FETCH BOOKINGS ---------------- */
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        time_slot,
        total_amount,
        job_status,
        technician_id,
        services (
          id,
          title,
          image_url,
          price
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    /* ---------------- GET TECHNICIANS ---------------- */
    const technicianIds = bookings
      .filter(b => b.technician_id)
      .map(b => b.technician_id)

    let techniciansMap: Record<string, any> = {}

    if (technicianIds.length > 0) {
      const { data: techs } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", technicianIds)

      techs?.forEach(t => {
        techniciansMap[t.id] = `${t.first_name} ${t.last_name}`
      })
    }

    /* ---------------- TRANSFORM DATA ---------------- */
const orders = bookings.map(b => {
  const status = b.job_status

  // 🔥 Supabase returns relation as array
  const service = Array.isArray(b.services) ? b.services[0] : b.services

  return {
    id: b.id,
    service_title: service?.title || null,
    service_image: service?.image_url || null,
    date: b.booking_date,
    time: b.time_slot,
    price: b.total_amount || 0,

    status,

    technician_name: b.technician_id
      ? techniciansMap[b.technician_id] || null
      : null,

    can_track: ["assigned", "on_the_way", "working"].includes(status),
    can_review: status === "completed",
    invoice_available: status === "completed",
  }
})

    /* ---------------- SUMMARY ---------------- */
    const summary = {
      total: orders.length,
      completed: orders.filter(o => o.status === "completed").length,
      upcoming: orders.filter(o =>
        ["open", "assigned", "on_the_way", "working"].includes(o.status)
      ).length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
    }

    res.json({
      success: true,
      summary,
      orders,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}