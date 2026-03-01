import crypto from "crypto";
export const config = {
    api: {
        bodyParser: false,
    },
    runtime: "nodejs", // ⭐ VERY IMPORTANT (prevents Edge runtime crash)
};
async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}
export default async function handler(req, res) {
    try {
        // Only POST allowed
        if (req.method !== "POST") {
            res.statusCode = 405;
            return res.end("Method Not Allowed");
        }
        const rawBody = await getRawBody(req);
        const signature = req.headers["x-razorpay-signature"];
        if (!signature) {
            console.log("❌ Missing signature");
            res.statusCode = 400;
            return res.end("Missing signature");
        }
        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex");
        if (signature !== expected) {
            console.log("❌ Invalid signature");
            res.statusCode = 400;
            return res.end("Invalid signature");
        }
        const payload = JSON.parse(rawBody.toString());
        console.log("📩 Razorpay Event:", payload.event);
        /* ---------------- PAYMENT CAPTURED ---------------- */
        if (payload.event === "payment.captured") {
            const bookingId = payload?.payload?.payment?.entity?.notes?.booking_id;
            if (!bookingId) {
                console.log("⚠️ booking_id missing");
                res.statusCode = 200;
                return res.end("ok");
            }
            console.log("🎯 Updating booking:", bookingId);
            // call your express backend
            await fetch(`${process.env.INTERNAL_API_URL}/api/payments/webhook-handler`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-internal-secret": process.env.INTERNAL_SECRET,
                },
                body: JSON.stringify({ bookingId }),
            });
            console.log("🎉 Payment processed:", bookingId);
        }
        // ALWAYS return 200 to Razorpay
        res.statusCode = 200;
        return res.end("OK");
    }
    catch (err) {
        console.log("💥 Webhook crash:", err);
        // VERY IMPORTANT: Razorpay requires 200 or it retries forever
        res.statusCode = 200;
        return res.end("OK");
    }
}
