import { Router } from "express";
import { supabase } from "../utils/supabase.js";

const router = Router();

router.post("/webhook-handler", async (req, res) => {
  try {
    if (req.headers["x-internal-secret"] !== process.env.INTERNAL_SECRET) {
      return res.status(403).send("Forbidden");
    }

    const { bookingId } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await supabase
      .from("bookings")
      .update({
        payment_status: "completed",
        closure_otp: otp,
      })
      .eq("id", bookingId);

    res.send("updated");
  } catch (e) {
    console.log(e);
    res.status(500).send("error");
  }
});

export default router;