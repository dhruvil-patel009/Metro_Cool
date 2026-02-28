import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { supabase } from "../utils/supabase.js";

const router = Router();

router.get(
  "/dashboard",
  protect,
  authorize("technician"),
  (req, res) => {
    res.json({ message: "Technician dashboard access granted" });
  }
);

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, middle_name, last_name, profile_photo")
    .eq("role", "technician")   // ⭐ THIS is the real filter

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // build full name
  const technicians = data.map((t) => ({
    id: t.id,
    name: [t.first_name, t.middle_name, t.last_name]
      .filter(Boolean)
      .join(" "),
    role: "AC Technician",
    photo_url: t.profile_photo || null,
  }))

  res.json(technicians)
})

export default router;
