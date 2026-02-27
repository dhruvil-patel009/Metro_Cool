import express from "express"
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
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

export default router