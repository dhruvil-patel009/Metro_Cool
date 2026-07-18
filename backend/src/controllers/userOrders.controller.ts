import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

export const getUserOrderHistory = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id

    /* ---------------- FETCH SERVICE BOOKINGS ---------------- */
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        time_slot,
        total_amount,
        job_status,
        payment_status,
        technician_id,
        created_at,
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

    /* ---------------- FETCH PRODUCT ORDERS ---------------- */
    const { data: productOrders, error: productError } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        total_amount,
        payment_status,
        customer_name,
        order_items (
          id, title, image, capacity, price, qty
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (productError) throw productError

    // Check payments table for any orders that might have been paid but status not updated
    const productOrderIds = (productOrders || []).map(o => o.id)
    let paidOrderIds: Set<string> = new Set()

    if (productOrderIds.length > 0) {
      const { data: payments } = await supabase
        .from("payments")
        .select("booking_id")
        .in("booking_id", productOrderIds)
        .eq("status", "captured")

      payments?.forEach(p => paidOrderIds.add(p.booking_id))
    }

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

    /* ---------------- TRANSFORM SERVICE BOOKINGS ---------------- */
    const serviceOrders = bookings.map(b => {
      const status = b.job_status
      const paymentDone = b.payment_status === "completed"
      const service = Array.isArray(b.services) ? b.services[0] : b.services

      return {
        id: b.id,
        type: "service" as const,
        title: service?.title || "AC Service",
        image: service?.image_url || null,
        date: b.booking_date,
        time: b.time_slot,
        price: b.total_amount || 0,
        status,
        payment_status: b.payment_status || "pending",
        created_at: b.created_at,

        technician_name: b.technician_id
          ? techniciansMap[b.technician_id] || null
          : null,

        can_track: ["assigned", "on_the_way", "working"].includes(status),
        can_review: status === "completed",
        invoice_available: status === "completed" || paymentDone,
      }
    })

    /* ---------------- TRANSFORM PRODUCT ORDERS ---------------- */
    const productOrdersMapped = (productOrders || [])
      .filter(o => {
        // Only show product orders that have been paid (online or COD)
        const ps = o.payment_status || "pending"
        return ps === "completed" || ps === "cod_pending" || paidOrderIds.has(o.id)
      })
      .map(o => {
      const items = o.order_items || []
      const firstItem = items[0]
      const itemCount = items.reduce((sum: number, i: any) => sum + (i.qty || 1), 0)
      const ps = o.payment_status || "pending"
      // Also check payments table as fallback
      const hasPaymentRecord = paidOrderIds.has(o.id)
      const paymentDone = ps === "completed" || ps === "cod_pending" || hasPaymentRecord

      // Determine display status
      let displayStatus = "pending"
      if (ps === "completed" || hasPaymentRecord) displayStatus = "confirmed"
      else if (ps === "cod_pending") displayStatus = "cod_confirmed"
      else displayStatus = "pending"

      return {
        id: o.id,
        type: "product" as const,
        title: itemCount > 1
          ? `${firstItem?.title || "Product"} +${itemCount - 1} more`
          : firstItem?.title || "Product Order",
        image: firstItem?.image || null,
        date: o.created_at,
        time: null,
        price: o.total_amount || 0,
        status: displayStatus,
        payment_status: paymentDone ? "completed" : ps,
        created_at: o.created_at,

        technician_name: null,
        can_track: false,
        can_review: false,
        invoice_available: paymentDone,
        item_count: itemCount,
        items,
      }
    })

    /* ---------------- MERGE & SORT BY DATE ---------------- */
    const allOrders = [...serviceOrders, ...productOrdersMapped].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    /* ---------------- SUMMARY ---------------- */
    const summary = {
      total: allOrders.length,
      completed: serviceOrders.filter(o => o.status === "completed").length +
                 productOrdersMapped.filter(o => o.payment_status === "completed" || o.payment_status === "cod_pending").length,
      upcoming: serviceOrders.filter(o =>
        ["open", "assigned", "on_the_way", "working"].includes(o.status)
      ).length,
    }

    res.json({
      success: true,
      summary,
      orders: allOrders,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}