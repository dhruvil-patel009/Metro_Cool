// routes/auth.routes.ts

import { Router } from "express";
import {
  register,
  logout,
  resetMpin,
  forgotMpin,
  loginWithMpin
} from "../controllers/auth.controller.js";
import { registerUpload } from "../middlewares/upload.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/register", authLimiter, registerUpload, register);

router.post("/login", authLimiter, loginWithMpin);
router.post("/forgot-mpin", authLimiter, forgotMpin);
router.post("/reset-mpin", authLimiter, resetMpin);
router.post("/logout", logout); // ✅ NEW



export default router;
