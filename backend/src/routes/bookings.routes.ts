import { Router } from "express"
import { completeBooking, createBooking, getAllBookings, getBookedDates, getBookingById, gettechnicianBookingById } from "../controllers/bookings.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/dates", getBookedDates)
router.get("/", protect, getAllBookings) // ✅ ADD THIS LINE
router.post("/",protect, createBooking)
// router.put("/:id", protect, completeBooking)

router.put("/:id/complete", protect, completeBooking)
router.get("/:id",protect, getBookingById) // ✅ ADD
router.get("/techjobs/:id",protect, gettechnicianBookingById) // ✅ ADD


export default router
