import express from "express"
import { getUserOrderHistory } from "../controllers/userOrders.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/me/orders", protect, getUserOrderHistory)

export default router