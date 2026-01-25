import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { getMe, updateMe } from "../controllers/user.controller.js";

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
router.put("/me", protect, authorize("user"), updateMe)


export default router;
