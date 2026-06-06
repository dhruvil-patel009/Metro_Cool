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

/* ── helper: build + upload invoice (non-fatal) ── */
const buildAndUploadInvoice = async ({
  booking_id,
  payment_id,
  amount,
  customer_name,
  service_name,
  otp,
  payment_row_id,
}: {
  booking_id: string
  payment_id: string
  amount: number
  customer_name: string
  service_name: string
  otp: string
  payment_row_id: string
}) => {
  try {
    const invoicePath = await generateInvoice({
      booking_id,
      payment_id,
      amount,
      customer_name,
      service_name,
      otp,
    })
    const invoiceUrl = await uploadInvoice(invoicePath, booking_id)
    try { fs.unlinkSync(invoicePath) } catch (_) { /* ignore */ }

    await supabase
      .from("payments")
      .update({ invoice_url: invoiceUrl })
      .eq("id", payment_row_id)

    return invoiceUrl
  } catch (err) {
    console.error("Invoice generation failed (non-fatal):", err)
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

    await buildAndUploadInvoice({
      booking_id,
      payment_id: razorpay_payment_id,
      amount: booking.total_amount,
      customer_name: customerName,
      service_name: serviceName,
      otp: closureOTP,
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
      service_name: serviceName,
      otp: closureOTP,
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
      service_name: serviceName,
      otp: closureOTP,
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

  // ── 2. Return existing URL ────────────────────────────
  if (paymentRow.invoice_url) {
    return res.json({ invoice_url: paymentRow.invoice_url })
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
      .select("first_name, last_name")
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
      service_name: serviceName,
      otp,
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
