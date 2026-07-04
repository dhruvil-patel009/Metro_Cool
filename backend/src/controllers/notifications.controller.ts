import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

/**
 * GET /api/admin/notification-preferences
 * Returns the admin's notification preferences
 */
export const getNotificationPreferences = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("admin_id", userId)
      .maybeSingle()

    if (error) throw error

    // Return defaults if no record exists
    if (!data) {
      return res.json({
        new_technician_registration: true,
        new_booking_created: true,
        settlement_reports: true,
        system_errors: true,
      })
    }

    res.json({
      new_technician_registration: data.new_technician_registration ?? true,
      new_booking_created: data.new_booking_created ?? true,
      settlement_reports: data.settlement_reports ?? true,
      system_errors: data.system_errors ?? true,
    })
  } catch (err) {
    console.error("Get notification preferences error:", err)
    res.status(500).json({ error: "Failed to load notification preferences" })
  }
}

/**
 * PUT /api/admin/notification-preferences
 * Saves the admin's notification preferences
 */
export const updateNotificationPreferences = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const {
      new_technician_registration,
      new_booking_created,
      settlement_reports,
      system_errors,
    } = req.body

    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        admin_id: userId,
        new_technician_registration,
        new_booking_created,
        settlement_reports,
        system_errors,
        updated_at: new Date().toISOString(),
      }, { onConflict: "admin_id" })

    if (error) throw error

    res.json({ message: "Notification preferences saved" })
  } catch (err) {
    console.error("Update notification preferences error:", err)
    res.status(500).json({ error: "Failed to save notification preferences" })
  }
}

/**
 * GET /api/notifications
 *
 * User-facing notifications derived from their bookings & orders.
 */
export const getUserNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ error: "Unauthorized" })

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // last 7 days

    const [bookingsResult, ordersResult] = await Promise.all([
      supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          booking_date,
          time_slot,
          job_status,
          service_id,
          services ( title )
        `)
        .eq("user_id", userId)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(15),

      supabase
        .from("orders")
        .select(`
          id,
          created_at,
          payment_status,
          total_amount
        `)
        .eq("user_id", userId)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(10),
    ])

    const notifications: any[] = []

    // Booking notifications
    for (const b of bookingsResult.data || []) {
      const serviceName = (b as any).services?.title || "AC Service"
      let title = ""
      let message = ""
      let type = "booking"

      switch (b.job_status) {
        case "open":
          title = "Booking Confirmed"
          message = `Your ${serviceName} booking has been confirmed.`
          break
        case "assigned":
          title = "Technician Assigned"
          message = `A technician has been assigned for your ${serviceName}.`
          break
        case "on_the_way":
          title = "Technician En Route"
          message = `Your technician is on the way for ${serviceName}.`
          break
        case "working":
          title = "Service Started"
          message = `Your ${serviceName} is now in progress.`
          break
        case "completed":
          title = "Service Completed"
          message = `Your ${serviceName} has been completed successfully.`
          type = "completed"
          break
        case "cancelled":
          title = "Booking Cancelled"
          message = `Your ${serviceName} booking was cancelled.`
          type = "cancelled"
          break
        default:
          title = "Booking Update"
          message = `Your ${serviceName} booking status was updated.`
      }

      notifications.push({
        id: `booking-${b.id}`,
        type,
        title,
        message,
        time: b.created_at,
        read: false,
        link: `/bookings?id=${b.id}`,
      })
    }

    // Order notifications
    for (const o of ordersResult.data || []) {
      const isPaid = o.payment_status === "completed"
      notifications.push({
        id: `order-${o.id}`,
        type: "order",
        title: isPaid ? "Order Paid" : "Order Placed",
        message: isPaid
          ? `Payment of ₹${Number(o.total_amount).toLocaleString("en-IN")} confirmed.`
          : `Your product order has been placed successfully.`,
        time: o.created_at,
        read: false,
        link: `/profile/orders`,
      })
    }

    // Sort by time
    notifications.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    )

    res.setHeader("Cache-Control", "no-store")
    res.json({ notifications: notifications.slice(0, 20) })
  } catch (err) {
    console.error("User notifications error:", err)
    res.status(500).json({ error: "Failed to load notifications" })
  }
}

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
