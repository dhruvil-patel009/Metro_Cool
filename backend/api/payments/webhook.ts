import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // ⭐⭐ THIS IS THE SECRET
  },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const rawBody = await getRawBody(req);

    const signature = req.headers["x-razorpay-signature"] as string;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) {
      console.log("❌ Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const payload = JSON.parse(rawBody.toString());

    console.log("📩 Razorpay Event:", payload.event);

    if (payload.event === "payment.captured") {
      const bookingId = payload.payload.payment.entity.notes.booking_id;

      // CALL YOUR EXPRESS BACKEND
      await fetch(`${process.env.INTERNAL_API_URL}/api/payments/webhook-handler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_SECRET!,
        },
        body: JSON.stringify({ bookingId }),
      });

      console.log("🎉 Payment processed:", bookingId);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.log("Webhook error:", err);
    return res.status(200).send("OK");
  }
}