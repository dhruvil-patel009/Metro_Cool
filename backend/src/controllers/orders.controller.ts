import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

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

    // Verify ownership
    const { data: order } = await supabase
      .from("orders")
      .select("id")
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
