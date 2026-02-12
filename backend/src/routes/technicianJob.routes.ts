import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  acceptJob,
  onTheWay,
  startWork,
  submitReport,
  completeJob,
  verifyOtpAndCloseJob,
} from "../controllers/technicianjob.controller.js";
import { getMyJobs, getOpenJobs } from "../controllers/technicianJobsList.controller.js";

const router = express.Router();

/* JOB FLOW */
router.patch("/:id/accept", protect, acceptJob);
router.patch("/:id/on-the-way", protect, onTheWay);
router.patch("/:id/start-work", protect, startWork);
router.patch("/:id/report", protect, submitReport);
router.patch("/:id/complete", protect, completeJob);

router.get("/open", protect, getOpenJobs);
router.get("/my", protect, getMyJobs);
router.patch("/:id/verify-otp", protect, verifyOtpAndCloseJob);

export default router;
