import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

/**
 * GET /api/admin/notifications
 *
 * Builds real-time notifications from live DB data:
 *  - Recent bookings (last 48 hrs)
 *  - Pending technician approval requests
 *  - Recent captured payments (last 48 hrs)
 *
 * No separate notifications table needed — derived from existing data.
 */
export const getAdminNotifications = async (req: Request, res: Response) => {
  try {
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

    const [bookingsResult, techRequestsResult, paymentsResult] =
      await Promise.all([
        // Recent new bookings
        supabase
          .from("bookings")
          .select(`
            id,
            created_at,
            full_name,
            booking_date,
            services ( title )
          `)
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10),

        // Pending technician requests (all pending, not time-filtered)
        supabase
          .from("technician_details")
          .select(`
            id,
            created_at,
            profiles!technician_details_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq("approval_status", "pending")
          .order("created_at", { ascending: false })
          .limit(10),

        // Recent payments captured
        supabase
          .from("payments")
          .select(`
            id,
            created_at,
            amount,
            booking_id
          `)
          .eq("status", "captured")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10),
      ])

    const notifications: any[] = []

    // Booking notifications
    for (const b of bookingsResult.data || []) {
      const serviceName = (b as any).services?.title || "AC Service"
      notifications.push({
        id: `booking-${b.id}`,
        type: "booking",
        title: "New Booking",
        message: `${b.full_name || "A customer"} booked ${serviceName}`,
        time: b.created_at,
        read: false,
      })
    }

    // Technician request notifications
    for (const t of techRequestsResult.data || []) {
      const profile = (t as any).profiles
      const name = profile
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : "A technician"
      notifications.push({
        id: `tech-${t.id}`,
        type: "technician",
        title: "Technician Approval Needed",
        message: `${name} is waiting for approval`,
        time: t.created_at,
        read: false,
      })
    }

    // Payment notifications
    for (const p of paymentsResult.data || []) {
      notifications.push({
        id: `payment-${p.id}`,
        type: "payment",
        title: "Payment Received",
        message: `₹${Number(p.amount).toLocaleString("en-IN")} received for booking #${String(p.booking_id).slice(0, 8).toUpperCase()}`,
        time: p.created_at,
        read: false,
      })
    }

    // Sort all by time descending
    notifications.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    )

    res.setHeader("Cache-Control", "no-store")
    res.json({ notifications: notifications.slice(0, 20) })
  } catch (err) {
    console.error("Notifications error:", err)
    res.status(500).json({ error: "Failed to load notifications" })
  }
}
