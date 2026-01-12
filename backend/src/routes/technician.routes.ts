import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("technician"),
  (req, res) => {
    res.json({ message: "Technician dashboard access granted" });
  }
);

export default router;
