import { Router } from "express"
import { completeBooking, createBooking, getAllBookings, getBookedDates, getBookingById, gettechnicianBookingById, updateJobStatus, cancelBooking, cancelJobByTechnician } from "../controllers/bookings.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/dates", getBookedDates)
router.get("/", protect, getAllBookings)
router.post("/", protect, createBooking)

router.put("/:id/complete", protect, completeBooking)
router.get("/:id", protect, getBookingById)
router.get("/techjobs/:id", protect, gettechnicianBookingById)

router.put("/:id/status", protect, updateJobStatus)
router.put("/:id/cancel", protect, cancelBooking)
router.put("/:id/cancel-by-technician", protect, cancelJobByTechnician)

export default router
