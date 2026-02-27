import { Router } from "express"
import {
  getSettlements,
  markPaid,
  markAllPaid,
  downloadSettlementReport,
  emailSettlementReport,
} from "../controllers/settlement.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", protect, getSettlements)
router.patch("/mark-paid/:paymentId", protect, markPaid)
router.patch("/mark-all-paid", protect, markAllPaid)
router.get("/download", protect, downloadSettlementReport)
router.post("/email", protect, emailSettlementReport)

export default router