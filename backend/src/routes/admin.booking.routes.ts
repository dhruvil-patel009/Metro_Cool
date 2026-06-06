import { Router } from "express"
import { getAllBookings, getAdminBookings, getBookingStats, getWeeklyBookingStats } from "../controllers/admin.booking.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const router = Router()

router.get("/bookings/stats", protect, authorize("admin"), getBookingStats)
router.get("/bookings/weekly-stats", protect, authorize("admin"), getWeeklyBookingStats)
router.get("/bookings", protect, authorize("admin"), getAdminBookings)

export default router
