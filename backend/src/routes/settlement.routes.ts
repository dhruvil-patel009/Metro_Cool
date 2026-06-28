import { Router } from "express"
import {
  getSettlements,
  markPaid,
  markAllPaid,
  downloadSettlementReport,
  emailSettlementReport,
} from "../controllers/settlement.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"

const router = Router()

router.get("/", protect, authorize("admin"), getSettlements)
router.patch("/mark-paid/:paymentId", protect, authorize("admin"), markPaid)
router.patch("/mark-all-paid", protect, authorize("admin"), markAllPaid)
router.get("/download", protect, authorize("admin"), downloadSettlementReport)
router.post("/email", protect, authorize("admin"), emailSettlementReport)

export default router