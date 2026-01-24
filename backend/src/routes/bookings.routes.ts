import { Router } from "express"
import { createBooking, getBookedDates } from "../controllers/bookings.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/dates", getBookedDates)
router.post("/",protect, createBooking)

export default router
