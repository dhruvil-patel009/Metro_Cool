import express from "express"
import {
  createOrder,
  markCODOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orders.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/",              protect, createOrder)
router.post("/cod",           protect, markCODOrder)
router.get("/my",             protect, getUserOrders)
router.get("/:id",            protect, getOrderById)

export default router
