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

const router = Router();

router.post("/register", registerUpload, register);

router.post("/login", loginWithMpin);
router.post("/forgot-mpin", forgotMpin);
router.post("/reset-mpin", resetMpin);
router.post("/logout", logout); // ✅ NEW



export default router;
