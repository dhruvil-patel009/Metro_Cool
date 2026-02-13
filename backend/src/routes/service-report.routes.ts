import { Router } from "express";
import { createServiceReport } from "../controllers/service-report.controller.js";
import { reportUpload } from "../middlewares/reportUpload.middleware.js";

const router = Router();

// multiple images upload
router.post(
  "/create",
  reportUpload.array("photos", 5),
  createServiceReport
);

export default router;
