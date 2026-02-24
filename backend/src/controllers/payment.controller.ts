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

export const createRazorpayOrder = async (req: Request, res: Response) => {
  const { booking_id, amount } = req.body

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR → paise
      currency: "INR",
      receipt: booking_id,
    })

    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" })
  }
}



export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const {
      booking_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      status, // used when user cancels checkout
    } = req.body

    // ----------------------------------------------------
    // 1️⃣ HANDLE CANCELLED PAYMENT (User closed Razorpay)
    // ----------------------------------------------------
    if (status === "cancelled") {
      await supabase.from("payments").insert({
        booking_id,
        status: "cancelled",
        raw_payload: req.body,
      })

      return res.json({
        success: false,
        message: "Payment cancelled by user",
      })
    }

    // ----------------------------------------------------
    // 2️⃣ VERIFY RAZORPAY SIGNATURE
    // ----------------------------------------------------
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    // ❌ INVALID SIGNATURE = PAYMENT FAILED / TAMPERED
    if (generatedSignature !== razorpay_signature) {
      await supabase.from("payments").insert({
        booking_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "failed",
        raw_payload: req.body,
      })

      return res.status(400).json({
        success: false,
        error: "Invalid payment signature",
      })
    }

    // ----------------------------------------------------
    // 3️⃣ GENERATE SERVICE CLOSURE OTP
    // ----------------------------------------------------
    const closureOTP = Math.floor(1000 + Math.random() * 9000).toString()

    // ----------------------------------------------------
    // 4️⃣ SAVE SUCCESS PAYMENT ENTRY
    // ----------------------------------------------------
    const { error: insertError } = await supabase.from("payments").insert({
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "captured",
      closure_otp: closureOTP,
      raw_payload: req.body,
    })

    if (insertError) {
      console.log("Payment insert error:", insertError)
      return res.status(500).json({ error: "DB payment insert failed" })
    }

    // ----------------------------------------------------
    // 5️⃣ UPDATE BOOKING STATUS
    // ----------------------------------------------------
    const { error: bookingError } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        closure_otp: closureOTP,
      })
      .eq("booking_id", booking_id)

    if (bookingError) {
      console.log("Booking update error:", bookingError)
    }

    // ----------------------------------------------------
    // 6️⃣ FETCH BOOKING DETAILS (for invoice)
    // ----------------------------------------------------
    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", booking_id)
      .single()

    // ----------------------------------------------------
    // 7️⃣ GENERATE INVOICE PDF
    // ----------------------------------------------------
    const invoicePath = await generateInvoice({
      booking_id,
      payment_id: razorpay_payment_id,
      amount: booking?.amount || 150,
      customer_name: booking?.customer_name || "Customer",
      service_name: booking?.service_name || "AC Service",
      otp: closureOTP,
    })

    // ----------------------------------------------------
    // 8️⃣ UPLOAD TO SUPABASE STORAGE
    // ----------------------------------------------------
    const invoiceUrl = await uploadInvoice(invoicePath, booking_id)

    // ----------------------------------------------------
    // 9️⃣ SAVE INVOICE URL IN DB
    // ----------------------------------------------------
    await supabase
      .from("payments")
      .update({ invoice_url: invoiceUrl })
      .eq("razorpay_payment_id", razorpay_payment_id)

    // ----------------------------------------------------
    // 🔟 FINAL RESPONSE TO FRONTEND
    // ----------------------------------------------------
    return res.json({
      success: true,
      closure_otp: closureOTP,
      invoice_url: invoiceUrl,
    })

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error)
    return res.status(500).json({
      success: false,
      error: "Payment verification failed",
    })
  }
}

export const razorpayWebhook = async (req: any, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  const shasum = crypto.createHmac("sha256", secret)
  shasum.update(req.body)
  const digest = shasum.digest("hex")

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).send("Invalid webhook signature")
  }

  const event = JSON.parse(req.body.toString())

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity

    await supabase.from("payments").insert({
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: "captured",
      payment_method: payment.method,
      raw_payload: payment,
    })
  }

  if (event.event === "payment.failed") {
    const payment = event.payload.payment.entity

    await supabase.from("payments").insert({
      razorpay_payment_id: payment.id,
      razorpay_order_id: payment.order_id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: "failed",
      payment_method: payment.method,
      raw_payload: payment,
    })
  }

  res.json({ status: "ok" })
}