import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"
import { sendOrderNotification } from "../utils/adminNotifications.js"

// ── Ahmedabad serviceable PIN codes ───────────────────────────────────────────
const AHMEDABAD_PIN_CODES = new Set([
  "380001", "380002", "380003", "380004", "380005", "380006", "380007",
  "380008", "380009", "380010", "380013", "380014", "380015", "380016",
  "380019", "380021", "380022", "380023", "380024", "380025", "380026",
  "380027", "380028", "380051", "380052", "380053", "380054", "380055",
  "380058", "380059", "380060", "380061", "380063", "382010", "382110",
  "382115", "382120", "382130", "382140", "382145", "382150", "382210",
  "382213", "382220", "382225", "382230", "382240", "382250", "382260",
  "382305", "382308", "382310", "382315", "382320", "382321", "382325",
  "382330", "382340", "382345", "382346", "382350", "382355", "382405",
  "382408", "382415", "382418", "382421", "382422", "382424", "382425",
  "382426", "382427", "382428", "382430", "382433", "382435", "382440",
  "382443", "382445", "382449", "382450", "382455", "382460", "382463",
  "382465", "382470", "382475", "382480", "382481", "382610", "382620",
  "382630", "382640", "382650", "382721", "382725", "382728", "382730",
  "382735", "382740", "382745", "382750", "382755", "382760", "382765",
  "382775", "382810", "382815", "382820", "382825", "382830", "382835",
  "382840", "382845", "382850", "382855", "382860",
])

// Safe column list — only columns that definitely exist in orders table
// If payment_method doesn't exist in your DB, remove it from this list
const ORDER_COLUMNS = `
  id,
  created_at,
  total_amount,
  payment_status,
  customer_name,
  phone,
  street,
  city,
  zip,
  order_items (
    id, title, image, capacity, price, qty
  )
`

/* ─── CREATE ORDER ─────────────────────────────────── */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, customer_name, phone, address, total_amount } = req.body

    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    if (!items?.length) return res.status(400).json({ error: "Cart is empty" })
    if (!customer_name || !phone || !address?.street || !address?.city || !address?.zip) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Validate Ahmedabad PIN code
    const pinCode = String(address.zip).trim()
    if (!AHMEDABAD_PIN_CODES.has(pinCode)) {
      return res.status(400).json({
        error: "Sorry, this product is currently not available for delivery in your area.",
        code: "PIN_NOT_SERVICEABLE",
      })
    }

    // Only insert columns that exist — no apartment, no payment_method
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: req.user.id,
        customer_name,
        phone,
        street: address.street,
        city: address.city,
        zip: address.zip,
        total_amount,
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Order creation error:", error)
      return res.status(500).json({ error: "Order creation failed", detail: error.message })
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      title: item.title,
      image: item.image,
      capacity: item.capacity,
      price: item.price,
      qty: item.qty,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) {
      console.error("Order items error:", itemsError)
    }

    res.json({ success: true, order })
  } catch (err: any) {
    console.error("Order creation exception:", err)
    res.status(500).json({ error: "Order creation failed", detail: err?.message })
  }
}

/* ─── MARK COD ORDER ───────────────────────────────── */
export const markCODOrder = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    if (!order_id) return res.status(400).json({ error: "order_id is required" })

    // Verify ownership and fetch order details
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_name, phone, street, city, zip, total_amount, user_id")
      .eq("id", order_id)
      .eq("user_id", req.user.id)
      .single()

    if (!order) return res.status(404).json({ error: "Order not found" })

    // Update to cod_pending — only update payment_status (always exists)
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "cod_pending" })
      .eq("id", order_id)

    if (error) {
      console.error("COD update error:", error)
      return res.status(500).json({ error: "Failed to update order" })
    }

    // ── Send admin email notification (non-blocking) ─────
    try {
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("title, qty, price, capacity")
        .eq("order_id", order_id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, email")
        .eq("id", req.user.id)
        .single()

      const customerName = profile
        ? `${profile.first_name} ${profile.last_name}`.trim()
        : order.customer_name || "Customer"

      const deliveryAddress = [order.street, order.city, order.zip].filter(Boolean).join(", ")

      sendOrderNotification({
        orderId: order_id,
        customerName,
        customerPhone: (profile as any)?.phone || order.phone || "",
        customerEmail: (profile as any)?.email,
        items: (orderItems || []).map((item: any) => ({
          title: item.title,
          qty: item.qty,
          price: item.price,
          capacity: item.capacity,
        })),
        totalAmount: order.total_amount,
        paymentStatus: "\uD83D\uDCB5 Cash on Delivery",
        deliveryAddress,
      })
    } catch (notifyErr) {
      console.error("COD order notification failed (non-fatal):", notifyErr)
    }

    res.json({ success: true })
  } catch (err) {
    console.error("COD mark error:", err)
    res.status(500).json({ error: "Failed to record COD order" })
  }
}

/* ─── GET USER ORDER HISTORY ───────────────────────── */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { data: orders, error } = await supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Get orders error:", error)
      return res.status(500).json({ error: "Failed to fetch orders", detail: error.message })
    }

    res.json({ orders: orders || [] })
  } catch (err) {
    console.error("Get orders exception:", err)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
}

/* ─── GET SINGLE ORDER ─────────────────────────────── */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })

    const { data: order, error } = await supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single()

    if (error || !order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json({ order })
  } catch (err) {
    console.error("Get order exception:", err)
    res.status(500).json({ error: "Failed to fetch order" })
  }
}
