import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getMe } from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("user"),
  (req, res) => {
    res.json({ message: "User dashboard access granted" });
  }
);

router.get("/me", protect, getMe)

export default router;
