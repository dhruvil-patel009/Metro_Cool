import { Router } from "express"
import { completeBooking, createBooking, getBookedDates, getBookingById } from "../controllers/bookings.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/dates", getBookedDates)
router.post("/",protect, createBooking)
router.put("/:id", protect, completeBooking)

router.put("/:id/complete", protect, completeBooking)
router.get("/:id", getBookingById) // ✅ ADD


export default router
