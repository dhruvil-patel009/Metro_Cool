import Razorpay from "razorpay"
import { Request, Response } from "express"
import crypto from "crypto"
import { supabase } from "../utils/supabase.js"
import { uploadInvoice } from "../utils/uploadInvoice.js"
import { generateInvoice } from "../utils/generateInvoice.js"

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID!,
key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

/* =========================================================
CREATE ORDER
========================================================= */
export const createRazorpayOrder = async (req: Request, res: Response) => {
try {
const { booking_id, amount } = req.body


if (!booking_id || !amount) {
  return res.status(400).json({ error: "Missing booking_id or amount" })
}

const order = await razorpay.orders.create({
  amount: Math.round(Number(amount) * 100),
  currency: "INR",
  receipt: booking_id,
  notes: {
    booking_id: booking_id,   // VERY IMPORTANT (used by webhook)
  },
})

res.json({
  orderId: order.id,
  key: process.env.RAZORPAY_KEY_ID,
})


} catch (err) {
console.log("ORDER ERROR:", err)
res.status(500).json({ error: "Failed to create order" })
}
}

/* =========================================================
VERIFY PAYMENT (ONLY SIGNATURE VALIDATION)
❌ DOES NOT INSERT DB
========================================================= */
export const verifyRazorpayPayment = async (req: Request, res: Response) => {
try {
const {
razorpay_payment_id,
razorpay_order_id,
razorpay_signature,
} = req.body


const generatedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex")

if (generatedSignature !== razorpay_signature) {
  return res.status(400).json({
    success: false,
    error: "Payment verification failed",
  })
}

return res.json({
  success: true,
  message: "Payment verified. Waiting for webhook confirmation...",
})


} catch (err) {
console.log("VERIFY ERROR:", err)
res.status(500).json({ error: "Verification failed" })
}
}

/* =========================================================
WEBHOOK (REAL PAYMENT CONFIRMATION)
THIS IS WHERE PAYMENT IS ACTUALLY STORED
========================================================= */
export const razorpayWebhook = async (req: any, res: Response) => {
try {
const secret = process.env.RAZORPAY_WEBHOOK_SECRET!


/* ---------- SIGNATURE VALIDATION ---------- */
const body = req.body

const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex")

const receivedSignature = req.headers["x-razorpay-signature"]

if (expectedSignature !== receivedSignature) {
  console.log("❌ Invalid webhook signature")
  return res.status(400).send("Invalid signature")
}

const event = JSON.parse(body.toString())

if (event.event !== "payment.captured") {
  return res.json({ status: "ignored" })
}

const payment = event.payload.payment.entity

/* =====================================================
   🔴 MOST IMPORTANT PART
   GET BOOKING ID FROM RAZORPAY ORDER NOTES
   (Payment notes are NOT reliable)
===================================================== */

let booking_id = payment.notes?.booking_id

// If payment.notes empty → fetch order
if (!booking_id) {
  console.log("Notes missing in payment. Fetching order...")
  const order = await razorpay.orders.fetch(payment.order_id)
  booking_id = order.notes?.booking_id
}

if (!booking_id) {
  console.log("❌ Booking ID missing even after fetching order")
  return res.json({ status: "booking id missing" })
}

console.log("Booking ID from Razorpay:", booking_id)

/* ---------- FIND BOOKING ---------- */
const { data: booking, error: bookingError } = await supabase
  .from("bookings")
  .select("*")
  .eq("booking_id", booking_id)
  .single()

if (bookingError || !booking) {
  console.log("❌ Booking not found:", booking_id)
  return res.json({ status: "booking not found" })
}

/* ---------- PREVENT DUPLICATE WEBHOOK ---------- */
const { data: existing } = await supabase
  .from("payments")
  .select("id")
  .eq("razorpay_payment_id", payment.id)
  .maybeSingle()

if (existing) {
  console.log("⚠️ Duplicate webhook ignored")
  return res.json({ status: "already processed" })
}

/* ---------- GENERATE OTP ---------- */
const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

/* ---------- INSERT PAYMENT ---------- */
const { data: insertedPayment, error: insertError } = await supabase
  .from("payments")
  .insert({
    booking_id,
    user_id: booking.user_id,
    razorpay_order_id: payment.order_id,
    razorpay_payment_id: payment.id,
    amount: payment.amount / 100,
    currency: payment.currency,
    payment_method: payment.method,
    status: "captured",
    payout_status: "pending",
    closure_otp: closureOTP,
    raw_payload: payment,
  })
  .select()
  .single()

if (insertError) {
  console.log("❌ PAYMENT INSERT ERROR:", insertError)
  return res.status(500).send("DB insert failed")
}

/* ---------- UPDATE BOOKING ---------- */
await supabase
  .from("bookings")
  .update({
    payment_status: "paid",
    closure_otp: closureOTP,
  })
  .eq("booking_id", booking_id)

/* ---------- GENERATE INVOICE ---------- */
const invoicePath = await generateInvoice({
  booking_id,
  payment_id: payment.id,
  amount: payment.amount / 100,
  customer_name: booking.customer_name,
  service_name: booking.service_name,
  otp: closureOTP,
})

const invoiceUrl = await uploadInvoice(invoicePath, booking_id)

await supabase
  .from("payments")
  .update({ invoice_url: invoiceUrl })
  .eq("id", insertedPayment.id)

console.log("✅ PAYMENT STORED + LINKED TO BOOKING")

res.json({ status: "ok" })


} catch (err) {
console.log("WEBHOOK ERROR:", err)
res.status(500).send("Webhook error")
}
}
