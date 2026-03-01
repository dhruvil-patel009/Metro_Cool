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

/* =========================================================
CREATE ORDER
========================================================= */
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { booking_id, amount } = req.body

    if (!booking_id || !amount) {
      return res.status(400).json({ message: "Invalid data" })
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: booking_id,
      notes: {
    booking_id: booking_id
  },
      payment_capture: true,
    })

    return res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Razorpay order failed" })
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
export const razorpayWebhook = async (req: Request, res: Response) => {
  try {

    // 1️⃣ ensure raw body exists
    if (!req.body) {
      console.log("❌ No raw body received")
      return res.status(400).send("No body")
    }

    const rawBody =
      Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body))

    const signature = req.headers["x-razorpay-signature"] as string

    if (!signature) {
      console.log("❌ Missing signature header")
      return res.status(400).send("Missing signature")
    }

    // 2️⃣ verify signature
    const expected = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex")

    if (expected !== signature) {
      console.log("❌ Signature mismatch")
      return res.status(400).send("Invalid signature")
    }

    // 3️⃣ parse payload safely
    let payload: any
    try {
      payload = JSON.parse(rawBody.toString())
    } catch (e) {
      console.log("❌ JSON parse failed")
      return res.status(400).send("Invalid JSON")
    }

    console.log("📩 Webhook event:", payload.event)

    // 4️⃣ handle payment
    if (payload.event === "payment.captured") {

      const payment = payload?.payload?.payment?.entity

      if (!payment) {
        console.log("❌ No payment entity")
        return res.status(200).send("ok")
      }

      const bookingId = payment?.notes?.booking_id

      if (!bookingId) {
        console.log("❌ booking_id missing in notes")
        return res.status(200).send("ok")
      }

      console.log("✅ Updating booking:", bookingId)

      const otp = Math.floor(1000 + Math.random() * 9000).toString()

      const { error } = await supabase
        .from("bookings")
        .update({
          payment_status: "completed",
          closure_otp: otp,
        })
        .eq("id", bookingId)

      if (error) {
        console.log("❌ Supabase error:", error)
        return res.status(500).send("DB update failed")
      }

      console.log("🎉 Booking updated successfully")
    }

    return res.status(200).send("OK")

  } catch (err) {
    console.log("💥 WEBHOOK CRASH:", err)
    return res.status(200).send("OK") 
    // IMPORTANT: Always return 200 to Razorpay
  }
}



/* =========================================================
CASH PAYMENT (MANUAL)
========================================================= */
export const markCashPayment = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.body
    const user_id = req.user!.id

    if (!booking_id) {
      return res.status(400).json({ error: "booking_id required" })
    }

    // find booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", booking_id)
      .single()

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // generate OTP
    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    // insert payment
    const { data: payment, error } = await supabase
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

    if (error) throw error

    // update booking
    await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        closure_otp: closureOTP,
      })
      .eq("booking_id", booking_id)

    /* ---------- INVOICE ---------- */
    const invoicePath = await generateInvoice({
      booking_id,
      payment_id: payment.id,
      amount: booking.total_amount,
      customer_name: booking.customer_name,
      service_name: booking.service_name,
      otp: closureOTP,
    })

    const invoiceUrl = await uploadInvoice(invoicePath, booking_id)

    await supabase
      .from("payments")
      .update({ invoice_url: invoiceUrl })
      .eq("id", payment.id)

    res.json({ success: true })

  } catch (err) {
    console.log("CASH PAYMENT ERROR:", err)
    res.status(500).json({ error: "Cash payment failed" })
  }
}

/* =========================================================
GET INVOICE URL
========================================================= */
export const getInvoice = async (req: Request, res: Response) => {
  const { bookingId } = req.params

  const { data } = await supabase
    .from("payments")
    .select("invoice_url")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!data) {
    return res.status(404).json({ error: "Invoice not found" })
  }

  res.json({ invoice_url: data.invoice_url })
}