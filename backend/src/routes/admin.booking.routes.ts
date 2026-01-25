import { Router } from "express"
import { getAllBookings, getAdminBookings,getBookingStats } from "../controllers/admin.booking.controller.js"
import { protect } from "../middlewares/auth.middleware.js"


const router = Router()

router.get("/bookings/stats", protect, getBookingStats)
router.get("/bookings", protect, getAdminBookings)

export default router
