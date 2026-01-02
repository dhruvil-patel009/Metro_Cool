import { Router } from "express";
import {
  register,
  loginWithPhone,
  verifyPhoneOtp
} from "../controllers/auth.controller.js";
import { registerUpload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/register", registerUpload, register);
router.post("/login-phone", loginWithPhone);
router.post("/verify-otp", verifyPhoneOtp);

export default router;
