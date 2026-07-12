import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  generateCode,
  getMyCode,
  validateCode,
  getMyReferrals,
  getMyDiscount,
} from "../controllers/referral.controller.js";

const router = Router();

/* ── PUBLIC: Validate a referral code (used during registration) ── */
router.get("/validate/:code", validateCode);

/* ── PROTECTED: Technician-only routes ── */
router.post("/generate", protect, authorize("technician"), generateCode);
router.get("/my-code", protect, authorize("technician"), getMyCode);
router.get("/my-referrals", protect, authorize("technician"), getMyReferrals);
router.get("/my-discount", protect, authorize("technician"), getMyDiscount);

export default router;
