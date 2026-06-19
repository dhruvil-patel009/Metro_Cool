import { Router } from "express"
import { getAllBookings, getAdminBookings, getBookingStats, getWeeklyBookingStats, getWeeklyRevenueStats, cancelBooking } from "../controllers/admin.booking.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const router = Router()

router.get("/bookings/stats", protect, authorize("admin"), getBookingStats)
router.get("/bookings/weekly-stats", protect, authorize("admin"), getWeeklyBookingStats)
router.get("/bookings/weekly-revenue", protect, authorize("admin"), getWeeklyRevenueStats)
router.get("/bookings", protect, authorize("admin"), getAdminBookings)
router.put("/bookings/:id/cancel", protect, authorize("admin"), cancelBooking)

export default router
