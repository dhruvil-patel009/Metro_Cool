import { Router } from "express"
import { createServiceFeedback, getFeedbackByBookingId } from "../controllers/feedback.controller.js"
import { protect } from "../middlewares/auth.middleware.js"


const router = Router()

// 🔐 Create feedback (USER only – enforced by RLS)
router.post("/", protect, createServiceFeedback)

// 🔐 Get feedback by booking
router.get(
  "/booking/:bookingId",
  protect,
  getFeedbackByBookingId
)

export default router
