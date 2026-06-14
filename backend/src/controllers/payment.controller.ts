import Razorpay from "razorpay"
import { Request, Response } from "express"
import crypto from "crypto"
import fs from "fs"
import { supabase } from "../utils/supabase.js"
import { uploadInvoice } from "../utils/uploadInvoice.js"
import { generateInvoice } from "../utils/generateInvoice.js"
import { env } from "../config/env.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

/* ── helper: build + upload invoice ── */
const buildAndUploadInvoice = async ({
  booking_id,
  payment_id,
  amount,
  customer_name,
  customer_phone,
  service_name,
  service_type,
  booking_date,
  time_slot,
  payment_method,
  payment_last4,
  payment_bank,
  payment_vpa,
  payment_date,
  payment_row_id,
}: {
  booking_id: string
  payment_id: string
  amount: number
  customer_name: string
  customer_phone?: string
  service_name: string
  service_type?: "service" | "product"
  booking_date?: string
  time_slot?: string
  payment_method?: string
  payment_last4?: string
  payment_bank?: string
  payment_vpa?: string
  payment_date?: string
  payment_row_id: string
}): Promise<string | null> => {
  try {
    console.log("[invoice] generating for booking:", booking_id)

    const invoicePath = await generateInvoice({
      booking_id,
      payment_id,
      amount,
      customer_name,
      customer_phone,
      service_name,
      service_type,
      booking_date,
      time_slot,
      payment_method,
      payment_last4,
      payment_bank,
      payment_vpa,
      payment_date,
      otp: "",
    })

    console.log("[invoice] PDF generated at:", invoicePath)

    const invoiceUrl = await uploadInvoice(invoicePath, booking_id)

    console.log("[invoice] uploaded to:", invoiceUrl)

    try { fs.unlinkSync(invoicePath) } catch (_) { /* ignore */ }

    await supabase
      .from("payments")
      .update({ invoice_url: invoiceUrl })
      .eq("id", payment_row_id)

    return invoiceUrl
  } catch (err: any) {
    console.error("[invoice] FAILED:", err?.message || err)
    console.error("[invoice] Stack:", err?.stack)
    return null
  }
}

/* =========================================================
   CREATE RAZORPAY ORDER
   Stores a pre-generated OTP in order notes so both
   verify + webhook use the same OTP (no race condition).
========================================================= */
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { booking_id, amount } = req.body

    if (!booking_id || !amount) {
      return res.status(400).json({ message: "booking_id and amount are required" })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify booking belongs to this user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, user_id, payment_status")
      .eq("id", booking_id)
      .eq("user_id", req.user.id)
      .single()

    if (bookingError || !booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Already paid — don't create another order
    if (booking.payment_status === "completed") {
      return res.status(400).json({ message: "This booking is already paid" })
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100)
    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    // Generate OTP once here — stored in notes so both verify & webhook read it
    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking_id.slice(0, 40),
      notes: {
        booking_id,
        closure_otp: closureOTP,
      },
    })

    return res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })

  } catch (err: any) {
    console.error("Razorpay order creation failed:", err?.error?.description || err?.message)
    return res.status(500).json({
      message: "Razorpay order failed",
      error: err?.error?.description || err?.message || "Unknown error",
    })
  }
}

/* =========================================================
   VERIFY PAYMENT
   - Validates HMAC signature
   - Full DB update fallback (works when webhook can't reach localhost)
   - Reads OTP from Razorpay order notes (same value as webhook)
   - Fetches real payment method from Razorpay API
========================================================= */
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body

    // ── 1. Validate inputs ──────────────────────────────
    if (!booking_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" })
    }

    // ── 2. Verify HMAC signature ─────────────────────────
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" })
    }

    // ── 3. Idempotency — skip if already processed ───────
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, invoice_url")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle()

    if (existingPayment) {
      return res.json({ success: true, message: "Already processed" })
    }

    // ── 4. Fetch booking (ownership check) ──────────────
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("id", booking_id)
      .single()

    if (bookingError || !booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Verify booking belongs to requesting user
    if (req.user && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized for this booking" })
    }

    // ── 5. Fetch OTP from Razorpay order notes + real payment method ──
    let closureOTP: string
    let paymentMethod = "card"

    try {
      // Give Razorpay a moment to register the payment before fetching
      const [orderDetails, paymentDetails] = await Promise.all([
        razorpay.orders.fetch(razorpay_order_id),
        razorpay.payments.fetch(razorpay_payment_id),
      ])
      closureOTP = (orderDetails as any).notes?.closure_otp
        || Math.floor(1000 + Math.random() * 9000).toString()
      paymentMethod = (paymentDetails as any).method || "card"
    } catch {
      // Razorpay API call failed — use fallback OTP
      closureOTP = Math.floor(1000 + Math.random() * 9000).toString()
    }

    // ── 6. Fetch user profile ─────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", booking.user_id)
      .single()

    // ── 7. Update booking ─────────────────────────────────
    const { error: bookingUpdateError } = await supabase
      .from("bookings")
      .update({ payment_status: "completed", closure_otp: closureOTP })
      .eq("id", booking_id)

    if (bookingUpdateError) {
      console.error("Booking update failed:", bookingUpdateError)
    }

    // ── 8. Insert payment row ─────────────────────────────
    const { data: paymentRow, error: insertError } = await supabase
      .from("payments")
      .insert({
        booking_id,
        user_id: booking.user_id,
        amount: booking.total_amount,
        currency: "INR",
        payment_method: paymentMethod,
        razorpay_payment_id,
        razorpay_order_id,
        status: "captured",
        closure_otp: closureOTP,
      })
      .select()
      .single()

    if (insertError || !paymentRow) {
      console.error("Payment insert error:", insertError)
      // Booking already updated — return success to not block user
      return res.json({ success: true, message: "Payment recorded (invoice pending)" })
    }

    // ── 9. Generate invoice (non-fatal) ───────────────────
    const customerName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : booking.full_name || "Customer"
    const serviceName = (booking.services as any)?.title || "AC Service"

    // Fetch card last4 / UPI VPA from Razorpay if available
    let paymentLast4: string | undefined
    let paymentVpa: string | undefined
    let paymentBank: string | undefined
    try {
      const pd = await razorpay.payments.fetch(razorpay_payment_id) as any
      paymentLast4 = pd?.card?.last4
      paymentVpa   = pd?.vpa
      paymentBank  = pd?.bank
    } catch (_) {}

    await buildAndUploadInvoice({
      booking_id,
      payment_id: razorpay_payment_id,
      amount: booking.total_amount,
      customer_name: customerName,
      customer_phone: (profile as any)?.phone,
      service_name: serviceName,
      service_type: "service",
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
      payment_method: paymentMethod,
      payment_last4: paymentLast4,
      payment_vpa: paymentVpa,
      payment_bank: paymentBank,
      payment_date: new Date().toISOString(),
      payment_row_id: paymentRow.id,
    })

    return res.json({ success: true, message: "Payment verified and recorded" })

  } catch (err) {
    console.error("Verify payment error:", err)
    return res.status(500).json({ error: "Verification failed" })
  }
}

/* =========================================================
   RAZORPAY WEBHOOK
   - Requires raw body (registered in app.ts before express.json)
   - Idempotent — skips if payment already processed
   - Reads OTP from order notes (same value as verify)
========================================================= */
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET
    const signature = req.headers["x-razorpay-signature"] as string

    if (!signature) {
      return res.status(400).send("Missing signature")
    }

    // Verify HMAC over raw body buffer
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex")

    if (expected !== signature) {
      console.error("Webhook: invalid signature")
      return res.status(400).send("Invalid signature")
    }

    let payload: any
    try {
      payload = JSON.parse(req.body.toString())
    } catch {
      return res.status(400).send("Invalid JSON payload")
    }

    if (payload.event !== "payment.captured") {
      // Other events (e.g. order.paid, payment.failed) — acknowledge and ignore
      return res.status(200).send("OK")
    }

    const payment = payload?.payload?.payment?.entity
    if (!payment) {
      return res.status(400).send("Invalid payload structure")
    }

    const bookingId = payment.notes?.booking_id
    if (!bookingId) {
      console.error("Webhook: no booking_id in notes")
      return res.status(400).send("Missing booking_id")
    }

    // ── Idempotency ──────────────────────────────────────
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("razorpay_payment_id", payment.id)
      .maybeSingle()

    if (existingPayment) {
      return res.status(200).send("Already processed")
    }

    // ── Fetch booking ────────────────────────────────────
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("id", bookingId)
      .single()

    if (!booking) {
      console.error("Webhook: booking not found:", bookingId)
      return res.status(404).send("Booking not found")
    }

    // ── Read OTP from order notes (same as verify) ───────
    const closureOTP: string = payment.notes?.closure_otp
      || Math.floor(1000 + Math.random() * 9000).toString()

    // ── Fetch profile ────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", booking.user_id)
      .single()

    // ── Update booking ───────────────────────────────────
    await supabase
      .from("bookings")
      .update({ payment_status: "completed", closure_otp: closureOTP })
      .eq("id", bookingId)

    // ── Insert payment row ───────────────────────────────
    const { data: paymentRow, error: insertError } = await supabase
      .from("payments")
      .insert({
        booking_id: bookingId,
        user_id: booking.user_id,
        amount: payment.amount / 100,
        currency: payment.currency,
        payment_method: payment.method || "card",
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.order_id,
        status: "captured",
        closure_otp: closureOTP,
      })
      .select()
      .single()

    if (insertError || !paymentRow) {
      console.error("Webhook: payment insert error:", insertError)
      // Still return 200 — booking was updated, Razorpay shouldn't retry
      return res.status(200).send("OK")
    }

    // ── Generate invoice (non-fatal) ─────────────────────
    const customerName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : booking.full_name || "Customer"
    const serviceName = (booking.services as any)?.title || "AC Service"

    await buildAndUploadInvoice({
      booking_id: bookingId,
      payment_id: payment.id,
      amount: booking.total_amount,
      customer_name: customerName,
      customer_phone: (profile as any)?.phone,
      service_name: serviceName,
      service_type: "service",
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
      payment_method: payment.method || "card",
      payment_last4: payment.card?.last4,
      payment_vpa: payment.vpa,
      payment_bank: payment.bank,
      payment_date: new Date().toISOString(),
      payment_row_id: paymentRow.id,
    })

    return res.status(200).send("OK")

  } catch (err) {
    console.error("Webhook error:", err)
    // Always return 200 to prevent Razorpay from retrying infinitely
    return res.status(200).send("OK")
  }
}

/* =========================================================
   CASH PAYMENT
========================================================= */
export const markCashPayment = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    if (!booking_id) {
      return res.status(400).json({ error: "booking_id is required" })
    }

    const user_id = req.user.id

    // ── Idempotency ──────────────────────────────────────
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("booking_id", booking_id)
      .eq("status", "cash_paid")
      .maybeSingle()

    if (existing) {
      return res.json({ success: true, message: "Cash payment already recorded" })
    }

    // ── Fetch booking (ownership check) ──────────────────
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("id", booking_id)
      .eq("user_id", user_id)
      .single()

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.payment_status === "completed") {
      return res.status(400).json({ error: "Booking already paid" })
    }

    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    // ── Insert payment ────────────────────────────────────
    const { data: paymentRow, error: insertError } = await supabase
      .from("payments")
      .insert({
        booking_id,
        user_id,
        amount: booking.total_amount,
        currency: "INR",
        payment_method: "cash",
        status: "cash_paid",
        closure_otp: closureOTP,
      })
      .select()
      .single()

    if (insertError || !paymentRow) {
      throw new Error("Failed to record payment")
    }

    // ── Update booking ────────────────────────────────────
    await supabase
      .from("bookings")
      .update({ payment_status: "completed", closure_otp: closureOTP })
      .eq("id", booking_id)

    // ── Generate invoice (non-fatal) ─────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user_id)
      .single()

    const customerName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : booking.full_name || "Customer"
    const serviceName = (booking.services as any)?.title || "AC Service"

    await buildAndUploadInvoice({
      booking_id,
      payment_id: paymentRow.id,
      amount: booking.total_amount,
      customer_name: customerName,
      customer_phone: (profile as any)?.phone,
      service_name: serviceName,
      service_type: "service",
      booking_date: booking.booking_date,
      time_slot: booking.time_slot,
      payment_method: "cash",
      payment_date: new Date().toISOString(),
      payment_row_id: paymentRow.id,
    })

    return res.json({ success: true })

  } catch (err) {
    console.error("Cash payment error:", err)
    return res.status(500).json({ error: "Cash payment failed" })
  }
}

/* =========================================================
   GET INVOICE
   - Auth protected (via route middleware)
   - Generates on-demand if not yet created
========================================================= */
export const getInvoice = async (req: Request, res: Response) => {
  const { bookingId } = req.params
  const forceRefresh = req.query.refresh === "1"

  // ── 1. Get payment row ────────────────────────────────
  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id, invoice_url, amount, closure_otp, booking_id, user_id, razorpay_payment_id")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!paymentRow) {
    return res.status(404).json({ error: "No payment found for this booking" })
  }

  // Ownership check (if user is authenticated)
  if (req.user && paymentRow.user_id !== req.user.id) {
    // Admins bypass this — check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single()

    if (profile?.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" })
    }
  }

  // ── 2. Return existing URL (skip if force refresh) ──
  if (paymentRow.invoice_url && !forceRefresh) {
    return res.json({ invoice_url: paymentRow.invoice_url })
  }

  // If forcing refresh, clear old URL so it regenerates
  if (forceRefresh && paymentRow.invoice_url) {
    await supabase
      .from("payments")
      .update({ invoice_url: null })
      .eq("id", paymentRow.id)
  }

  // ── 3. Generate on-demand ─────────────────────────────
  try {
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, services(title)")
      .eq("id", bookingId)
      .single()

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", paymentRow.user_id)
      .single()

    const customerName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : booking?.full_name || "Customer"
    const serviceName = (booking?.services as any)?.title || "AC Service"
    const otp = paymentRow.closure_otp || booking?.closure_otp || "----"

    const invoiceUrl = await buildAndUploadInvoice({
      booking_id: bookingId,
      payment_id: paymentRow.razorpay_payment_id || paymentRow.id,
      amount: paymentRow.amount,
      customer_name: customerName,
      customer_phone: (profile as any)?.phone,
      service_name: serviceName,
      service_type: "service",
      booking_date: booking?.booking_date,
      time_slot: booking?.time_slot,
      payment_method: (paymentRow as any).payment_method || "card",
      payment_date: (paymentRow as any).created_at,
      payment_row_id: paymentRow.id,
    })

    if (!invoiceUrl) {
      return res.status(500).json({ error: "Failed to generate invoice" })
    }

    return res.json({ invoice_url: invoiceUrl })

  } catch (err) {
    console.error("On-demand invoice error:", err)
    return res.status(500).json({ error: "Failed to generate invoice" })
  }
}

/* =========================================================
   PRODUCT ORDER — CREATE RAZORPAY ORDER
   Works with the orders table (product purchases).
========================================================= */
export const createProductRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { order_id, amount } = req.body

    if (!order_id || !amount) {
      return res.status(400).json({ message: "order_id and amount are required" })
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Verify order belongs to this user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, user_id, payment_status")
      .eq("id", order_id)
      .eq("user_id", req.user.id)
      .single()

    if (orderError || !order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (order.payment_status === "completed") {
      return res.status(400).json({ message: "This order is already paid" })
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100)
    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order_id.slice(0, 40),
      notes: {
        order_id,
        type: "product",
        closure_otp: closureOTP,
      },
    })

    return res.json({
      success: true,
      orderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
    })

  } catch (err: any) {
    console.error("Product Razorpay order failed:", err?.error?.description || err?.message)
    return res.status(500).json({
      message: "Razorpay order failed",
      error: err?.error?.description || err?.message || "Unknown error",
    })
  }
}

/* =========================================================
   PRODUCT ORDER — VERIFY PAYMENT
   Verifies + updates the orders table for product purchases.
========================================================= */
export const verifyProductPayment = async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body

    if (!order_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" })
    }

    // Verify HMAC signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" })
    }

    // Idempotency
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("razorpay_payment_id", razorpay_payment_id)
      .maybeSingle()

    if (existingPayment) {
      return res.json({ success: true, message: "Already processed" })
    }

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single()

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" })
    }

    if (req.user && order.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized for this order" })
    }

    // Fetch real payment method from Razorpay
    let paymentMethod = "card"
    try {
      const pd = await razorpay.payments.fetch(razorpay_payment_id) as any
      paymentMethod = pd?.method || "card"
    } catch {}

    // Update order payment status
    await supabase
      .from("orders")
      .update({ payment_status: "completed" })
      .eq("id", order_id)

    // Insert payment row
    const { data: paymentRow, error: insertError } = await supabase
      .from("payments")
      .insert({
        booking_id: order_id,
        user_id: order.user_id,
        amount: order.total_amount,
        currency: "INR",
        payment_method: paymentMethod,
        razorpay_payment_id,
        razorpay_order_id,
        status: "captured",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Product payment insert error:", insertError)
    }

    // Generate invoice for product order
    if (paymentRow) {
      try {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("title")
          .eq("order_id", order_id)
          .limit(1)
          .single()

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone")
          .eq("id", order.user_id)
          .single()

        const customerName = profile
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : order.customer_name || "Customer"

        const productName = (orderItems as any)?.title || "AC Product"

        await buildAndUploadInvoice({
          booking_id: order_id,
          payment_id: razorpay_payment_id,
          amount: order.total_amount,
          customer_name: customerName,
          customer_phone: (profile as any)?.phone || order.phone,
          service_name: productName,
          service_type: "product",
          payment_method: paymentMethod,
          payment_date: new Date().toISOString(),
          payment_row_id: paymentRow.id,
        })
      } catch (invoiceErr) {
        console.error("Product invoice generation failed (non-fatal):", invoiceErr)
      }
    }

    return res.json({ success: true, message: "Product payment verified and recorded" })

  } catch (err) {
    console.error("Verify product payment error:", err)
    return res.status(500).json({ error: "Verification failed" })
  }
}

/* =========================================================
   GET ORDER INVOICE (product orders)
   Fetches or generates invoice for a product order
========================================================= */
export const getOrderInvoice = async (req: Request, res: Response) => {
  const { orderId } = req.params

  // Find payment row for this order
  const { data: paymentRow } = await supabase
    .from("payments")
    .select("id, invoice_url, amount, user_id, razorpay_payment_id, payment_method, created_at")
    .eq("booking_id", orderId)   // product orders store order_id in booking_id column
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  // Ownership check
  if (req.user && paymentRow?.user_id !== req.user.id) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", req.user.id).single()
    if (profile?.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" })
    }
  }

  // Return existing invoice if available
  if (paymentRow?.invoice_url) {
    return res.json({ invoice_url: paymentRow.invoice_url })
  }

  // Generate on-demand
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*, order_items(title, price, qty)")
      .eq("id", orderId)
      .single()

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", order.user_id)
      .single()

    const customerName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : order.customer_name || "Customer"

    const productName = order.order_items?.[0]?.title || "AC Product"

    const paymentId = paymentRow?.razorpay_payment_id || orderId
    const amount = paymentRow?.amount || order.total_amount
    const paymentRowId = paymentRow?.id

    const invoicePath = await generateInvoice({
      booking_id: orderId,
      payment_id: paymentId,
      amount,
      customer_name: customerName,
      customer_phone: (profile as any)?.phone || order.phone,
      service_name: productName,
      service_type: "product",
      payment_method: (paymentRow as any)?.payment_method || "card",
      payment_date: (paymentRow as any)?.created_at || new Date().toISOString(),
      otp: "",
    })

    const invoiceUrl = await uploadInvoice(invoicePath, orderId)
    try { require("fs").unlinkSync(invoicePath) } catch (_) {}

    if (paymentRowId) {
      await supabase
        .from("payments")
        .update({ invoice_url: invoiceUrl })
        .eq("id", paymentRowId)
    }

    return res.json({ invoice_url: invoiceUrl })
  } catch (err) {
    console.error("Order invoice error:", err)
    return res.status(500).json({ error: "Failed to generate invoice" })
  }
}
