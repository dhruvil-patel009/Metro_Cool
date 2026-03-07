import Razorpay from "razorpay"
import { Request, Response } from "express"
import crypto from "crypto"
import { supabase } from "../utils/supabase.js"
import { uploadInvoice } from "../utils/uploadInvoice.js"
import { generateInvoice } from "../utils/generateInvoice.js"
import { env } from "../config/env.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

console.log("KEY:", process.env.RAZORPAY_KEY_ID)
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET ? "EXISTS" : "MISSING")
/* =========================================================
CREATE ORDER
========================================================= */

console.log("Backend key:", process.env.RAZORPAY_KEY_ID)

export const createRazorpayOrder = async (req: Request, res: Response) => {
  console.log("🔥 CREATE ORDER HIT")

  try {
    const { booking_id, amount } = req.body

    console.log("Incoming body:", req.body)

    if (!booking_id || !amount) {
      return res.status(400).json({ message: "Invalid data" })
    }

    const amountInPaise = Math.round(parseFloat(amount) * 100)

    console.log("Amount in paise:", amountInPaise)

    if (!amountInPaise || isNaN(amountInPaise)) {
      return res.status(400).json({ message: "Invalid amount format" })
    }

    console.log("Using KEY:", process.env.RAZORPAY_KEY_ID)
    console.log("Secret exists:", !!process.env.RAZORPAY_KEY_SECRET)

const order = await razorpay.orders.create({
  amount: amountInPaise,
  currency: "INR",
  receipt: booking_id,   // ✅ FIXED
  notes: { booking_id },
})

    console.log("Order created:", order)

    return res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })

  } catch (err: any) {
    console.error("❌ FULL RAZORPAY ERROR:")
    console.error(err)

    return res.status(500).json({
      message: "Razorpay order failed",
      error: err?.error?.description || err?.message || err,
    })
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

    console.log("✅ Signature verified")

    return res.json({
      success: true,
      message: "Signature verified successfully"
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
export const razorpayWebhook = async (req: Request, res: Response) => {

  try {

    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET
    const signature = req.headers["x-razorpay-signature"] as string

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex")

    if (expected !== signature) {
      console.log("❌ Invalid webhook signature")
      return res.status(400).send("Invalid signature")
    }

    const payload = JSON.parse(req.body.toString())

    if (payload.event === "payment.captured") {

      const payment = payload.payload.payment.entity
      const bookingId = payment.notes?.booking_id

      if (!bookingId) {
        return res.status(400).send("No booking id")
      }

      console.log("✅ Payment Captured:", bookingId)

      /* 🔥 FIX: PREVENT DUPLICATE PAYMENTS */

      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("razorpay_payment_id", payment.id)
        .maybeSingle()

      if (existingPayment) {
        console.log("⚠️ Payment already exists")
        return res.status(200).send("Already processed")
      }

      /* GET BOOKING */

      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single()

      if (!booking) {
        return res.status(404).send("Booking not found")
      }

      /* 🔥 GENERATE OTP */

      const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

      /* UPDATE BOOKING */

      await supabase
        .from("bookings")
        .update({
          payment_status: "completed",
          closure_otp: closureOTP
        })
        .eq("id", bookingId)

      /* 🔥 INSERT PAYMENT */

      const { data: paymentRow } = await supabase
        .from("payments")
        .insert({
          booking_id: bookingId,
          user_id: booking.user_id,         // ✅ ADDED
          amount: payment.amount / 100,
          currency: payment.currency,
          payment_method: payment.method,   // ✅ REAL METHOD (upi/card)
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: "captured",
          closure_otp: closureOTP
        })
        .select()
        .single()

      /* GENERATE INVOICE */

      const invoicePath = await generateInvoice({
        booking_id: bookingId,
        payment_id: paymentRow.id,
        amount: booking.total_amount,
        customer_name: booking.customer_name,
        service_name: booking.service_name,
        otp: closureOTP,
      })

      const invoiceUrl = await uploadInvoice(invoicePath, bookingId)

      await supabase
        .from("payments")
        .update({ invoice_url: invoiceUrl })
        .eq("id", paymentRow.id)
    }

    res.status(200).send("OK")

  } catch (err) {

    console.log("Webhook error:", err)
    res.status(500).send("Webhook failure")

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

    const user_id = req.user.id

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single()

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    const { data: payment } = await supabase
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

    await supabase
      .from("bookings")
      .update({
        payment_status: "completed",
        closure_otp: closureOTP,
      })
      .eq("id", booking_id)

    res.json({ success: true })

  } catch (err) {

    console.log("CASH PAYMENT ERROR:", err)
    res.status(500).json({ error: "Cash payment failed" })

  }
}

/* =========================================================
GET INVOICE
========================================================= */

export const getInvoice = async (req: Request, res: Response) => {

  const { bookingId } = req.params

  const { data, error } = await supabase
    .from("payments")
    .select("invoice_url")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data?.invoice_url) {
    return res.status(404).json({
      error: "Invoice not found"
    })
  }

  res.json({
    invoice_url: data.invoice_url
  })
}