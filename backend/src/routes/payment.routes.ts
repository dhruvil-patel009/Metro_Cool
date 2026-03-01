import express from "express"
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
  markCashPayment,
  getInvoice,
} from "../controllers/payment.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

// create order
router.post("/razorpay-order", protect, createRazorpayOrder)

// only signature verify
router.post("/verify", protect, verifyRazorpayPayment)

// 🚨 CRITICAL — RAW BODY REQUIRED FOR RAZORPAY
router.post(
  "/webhook",
  express.raw({ type: "*/*" }),
  razorpayWebhook
)

router.post("/cash", protect, markCashPayment)
router.get("/invoice/:bookingId", protect, getInvoice)

export default router