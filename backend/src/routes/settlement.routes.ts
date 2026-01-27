import { downloadSettlementReport, emailSettlementReport } from "../controllers/settlement.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { Router } from "express";

const router = Router();


router.post("/download", protect, downloadSettlementReport)
router.post("/email", protect, emailSettlementReport)

export default router;
