import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/role.middleware.js"
import {
  acceptJob,
  onTheWay,
  startWork,
  submitReport,
  completeJob,
  verifyOtpAndCloseJob,
} from "../controllers/technicianjob.controller.js"
import { getMyJobs, getOpenJobs } from "../controllers/technicianJobsList.controller.js"

const router = express.Router()

router.patch("/:id/accept",     protect, authorize("technician"), acceptJob)
router.patch("/:id/on-the-way", protect, authorize("technician"), onTheWay)
router.patch("/:id/start-work", protect, authorize("technician"), startWork)
router.patch("/:id/report",     protect, authorize("technician"), submitReport)
router.patch("/:id/complete",   protect, authorize("technician"), completeJob)
router.patch("/:id/verify-otp", protect, authorize("technician"), verifyOtpAndCloseJob)

router.get("/open", protect, authorize("technician"), getOpenJobs)
router.get("/my",   protect, authorize("technician"), getMyJobs)

export default router
