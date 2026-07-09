import { Router } from "express";
import {
  createServiceReport,
  getAllServiceReports,
  getMyServiceReports,
  getServiceReportById,
  getServiceReportByJobId,
} from "../controllers/service-report.controller.js";
import { reportUpload } from "../middlewares/reportUpload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// multiple images upload
router.post(
  "/create",
  reportUpload.array("photos", 5),
  createServiceReport
);

// Admin: get all service reports
router.get("/all", protect, authorize("admin"), getAllServiceReports);

// Technician: get own service reports
router.get("/my", protect, authorize("technician"), getMyServiceReports);

// Get single report by ID
router.get("/:id", protect, getServiceReportById);

// Get report by job ID
router.get("/job/:jobId", protect, getServiceReportByJobId);

export default router;
