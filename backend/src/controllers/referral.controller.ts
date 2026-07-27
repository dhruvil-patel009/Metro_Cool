import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import { transporter, MAIL_FROM } from "../utils/mailer.js";
import { sendPush } from "../utils/push.js";
import { env } from "../config/env.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.resolve(__dirname, "../../templates");

const REFERRAL_AMOUNT = 400; // ₹400 flat cash credit

/* =========================================================
   HELPER: Generate a unique 8-char referral code
========================================================= */
function generateReferralCode(firstName: string): string {
  const prefix = firstName.substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase().substring(0, 5);
  return `${prefix}${random}`;
}

/* =========================================================
   HELPER: Load and populate an HTML email template
========================================================= */
function loadTemplate(fileName: string, replacements: Record<string, string>): string {
  const filePath = path.join(templatesDir, fileName);
  if (!fs.existsSync(filePath)) throw new Error(`Template not found: ${filePath}`);
  let html = fs.readFileSync(filePath, "utf-8");
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

/* =========================================================
   POST /api/referral/generate
========================================================= */
export const generateCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { data: existing } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("technician_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (existing) {
      return res.json({
        message: "Referral code already exists",
        referralCode: existing.code,
        createdAt: existing.created_at,
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .single();

    const firstName = profile?.first_name || "REF";

    let code = "";
    let attempts = 0;
    while (attempts < 5) {
      code = generateReferralCode(firstName);
      const { data: duplicate } = await supabase
        .from("referral_codes")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (!duplicate) break;
      attempts++;
    }

    if (attempts >= 5) {
      return res.status(500).json({ error: "Failed to generate unique code. Try again." });
    }

    const { data: newCode, error } = await supabase
      .from("referral_codes")
      .insert({ technician_id: userId, code, is_active: true })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      message: "Referral code generated successfully",
      referralCode: newCode.code,
      createdAt: newCode.created_at,
    });
  } catch (err) {
    console.error("GENERATE REFERRAL CODE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/my-code
========================================================= */
export const getMyCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { data, error } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("technician_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.json({ referralCode: null, message: "No referral code generated yet" });

    return res.json({ referralCode: data.code, createdAt: data.created_at });
  } catch (err) {
    console.error("GET MY CODE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/validate/:code  (public)
========================================================= */
export const validateCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (!code || code.trim().length === 0) {
      return res.status(400).json({ valid: false, error: "Code is required" });
    }

    const { data, error } = await supabase
      .from("referral_codes")
      .select("id, technician_id, code, is_active")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error) return res.status(500).json({ valid: false, error: error.message });
    if (!data) return res.json({ valid: false, message: "Invalid or expired referral code" });

    const { data: referrer } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", data.technician_id)
      .single();

    const referrerName = referrer
      ? `${referrer.first_name} ${referrer.last_name}`.trim()
      : "A technician";

    return res.json({
      valid: true,
      referrerName,
      message: `Referred by ${referrerName}. They'll earn ₹400 once you complete 3 jobs!`,
    });
  } catch (err) {
    console.error("VALIDATE CODE ERROR:", err);
    return res.status(500).json({ valid: false, error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/my-referrals
========================================================= */
export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Fetch ALL reward rows where this technician is the referrer.
    // Also check via referral_code → technician_id in case old rows
    // stored a different referrer_id format.
    const { data: rewards, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Also fetch rewards where this technician owns the referral_code
    // (catches legacy rows that may have a mislinked referrer_id)
    const { data: myCode } = await supabase
      .from("referral_codes")
      .select("id")
      .eq("technician_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    let extraRewards: any[] = [];
    if (myCode?.id) {
      const { data: codeRewards } = await supabase
        .from("referral_rewards")
        .select("*")
        .eq("referral_code_id", myCode.id)
        .order("created_at", { ascending: false });

      // Merge: only add rows not already in the main rewards list
      const existingIds = new Set((rewards || []).map((r: any) => r.id));
      extraRewards = (codeRewards || []).filter((r: any) => !existingIds.has(r.id));
    }

    const allRewards = [...(rewards || []), ...extraRewards];

    const enrichedRewards = [];
    for (const reward of allRewards) {
      const { data: referred } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", reward.referred_id)
        .single();

      // Normalise legacy status values:
      // "active"  (old system) → treat as "pending"
      // "used"    (old system) → treat as "credited"
      let normalizedStatus: string = reward.reward_status;
      if (normalizedStatus === "active") normalizedStatus = "pending";
      if (normalizedStatus === "used")   normalizedStatus = "credited";

      // Normalise reward value — old rows had 5 (percentage), new rows have 400
      const normalizedValue =
        reward.reward_type === "cash_credit" ? Number(reward.reward_value) : 400;

      // jobs_remaining: old system had 3 jobs for "next 3 jobs" discount,
      // new system tracks jobs until unlock. Treat consistently.
      const jobsRemaining = reward.jobs_remaining ?? 0;
      const jobsCompleted = Math.max(0, 3 - jobsRemaining);

      enrichedRewards.push({
        id: reward.id,
        referredName: referred
          ? `${referred.first_name} ${referred.last_name}`.trim()
          : "Unknown",
        rewardType: reward.reward_type,
        rewardValue: normalizedValue,
        rewardStatus: normalizedStatus,     // always "pending" | "credited"
        jobsCompleted,
        jobsRemaining,
        createdAt: reward.created_at,
      });
    }

    // Sort by created_at descending after merge
    enrichedRewards.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalEarned = enrichedRewards
      .filter((r) => r.rewardStatus === "credited")
      .reduce((sum, r) => sum + r.rewardValue, 0);

    return res.json({
      totalReferrals: enrichedRewards.length,
      pendingRewards: enrichedRewards.filter((r) => r.rewardStatus === "pending").length,
      creditedRewards: enrichedRewards.filter((r) => r.rewardStatus === "credited").length,
      totalEarned,
      referrals: enrichedRewards,
    });
  } catch (err) {
    console.error("GET MY REFERRALS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/my-discount  (kept for backwards compat — now returns cash_credit)
========================================================= */
export const getMyDiscount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const { data: rewards, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_id", userId)
      .in("reward_status", ["credited", "used"]);  // covers old + new

    if (error) return res.status(500).json({ error: error.message });
    if (!rewards || rewards.length === 0) {
      return res.json({ hasCredit: false, totalCredit: 0 });
    }

    const totalCredit = rewards.reduce((sum, r) => sum + Number(r.reward_value), 0);

    return res.json({
      hasCredit: true,
      totalCredit,
      creditedRewards: rewards.map((r) => ({
        id: r.id,
        rewardValue: r.reward_value,
        creditedAt: r.updated_at || r.created_at,
      })),
    });
  } catch (err) {
    console.error("GET MY DISCOUNT ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   INTERNAL: Called from technicianjob.controller after each job close.

   Finds the pending referral_reward where `referred_id` = technicianId
   (i.e., this technician was referred by someone).
   Decrements jobs_remaining. When it hits 0, marks as "credited"
   and fires emails + push notification to the referrer.
========================================================= */
export const processReferralOnJobComplete = async (referredTechId: string): Promise<void> => {
  try {
    // Find the pending reward where THIS technician is the referred one.
    // Handle both new ("pending") and legacy ("active") status values.
    const { data: reward, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referred_id", referredTechId)
      .in("reward_status", ["pending", "active"])   // covers old + new rows
      .gt("jobs_remaining", 0)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !reward) return; // no pending reward for this tech

    const newJobsRemaining = reward.jobs_remaining - 1;

    if (newJobsRemaining > 0) {
      // Just decrement — not done yet
      await supabase
        .from("referral_rewards")
        .update({ jobs_remaining: newJobsRemaining })
        .eq("id", reward.id);

      console.log(
        `[referral] Job counted for referred tech ${referredTechId}. Jobs remaining: ${newJobsRemaining}`
      );
      return;
    }

    // ── All 3 jobs done → credit the ₹400 ──
    await supabase
      .from("referral_rewards")
      .update({ jobs_remaining: 0, reward_status: "credited" })
      .eq("id", reward.id);

    console.log(`[referral] ✅ ₹400 credited for referrer ${reward.referrer_id}`);

    // Fetch referrer profile + email
    const { data: referrerProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name, email")
      .eq("id", reward.referrer_id)
      .maybeSingle();

    // Fetch referred technician profile
    const { data: referredProfile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", referredTechId)
      .maybeSingle();

    const referrerName = referrerProfile
      ? `${referrerProfile.first_name} ${referrerProfile.last_name}`.trim()
      : "Technician";
    const referredName = referredProfile
      ? `${referredProfile.first_name} ${referredProfile.last_name}`.trim()
      : "Your referred technician";
    const referrerEmail = referrerProfile?.email || null;
    const year = new Date().getFullYear();
    const creditDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // ── 1. Email to Technician (referrer) ──
    if (referrerEmail) {
      try {
        const techHtml = loadTemplate("referral-credit-technician.html", {
          referrerName,
          referredName,
          amount: "₹400",
          creditDate,
          year: String(year),
        });

        await transporter.sendMail({
          from: MAIL_FROM,
          to: referrerEmail,
          subject: `🎉 Your referral reward of ₹400 has been credited — Metro Cool`,
          html: techHtml,
        });
        console.log(`[referral] ✅ Technician email sent to ${referrerEmail}`);
      } catch (mailErr) {
        console.error("[referral] ⚠️ Technician email failed (non-fatal):", mailErr);
      }
    }

    // ── 2. Email to Admin ──
    try {
      const adminHtml = loadTemplate("referral-credit-admin.html", {
        referrerName,
        referrerEmail: referrerEmail || "N/A",
        referredName,
        amount: "₹400",
        creditDate,
        year: String(year),
      });

      await transporter.sendMail({
        from: MAIL_FROM,
        to: env.ADMIN_EMAIL,
        subject: `[REFERRAL] ₹400 credit due — ${referrerName} referred ${referredName}`,
        html: adminHtml,
      });
      console.log(`[referral] ✅ Admin email sent to ${env.ADMIN_EMAIL}`);
    } catch (mailErr) {
      console.error("[referral] ⚠️ Admin email failed (non-fatal):", mailErr);
    }

    // ── 3. Push notification to technician (referrer) ──
    try {
      const { data: pushRow } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", reward.referrer_id)
        .maybeSingle();

      if (pushRow?.endpoint) {
        const subscription = {
          endpoint: pushRow.endpoint,
          keys: { p256dh: pushRow.p256dh, auth: pushRow.auth },
        };
        await sendPush(subscription, {
          title: "₹400 Referral Reward Credited! 🎉",
          body: `${referredName} completed 3 jobs. Your ₹400 referral bonus is ready. Contact admin to transfer.`,
          icon: "/icon-192x192.png",
        });
        console.log(`[referral] ✅ Push notification sent to referrer ${reward.referrer_id}`);
      } else {
        console.log(`[referral] No push subscription for referrer ${reward.referrer_id} — skipping push`);
      }
    } catch (pushErr) {
      console.error("[referral] ⚠️ Push notification failed (non-fatal):", pushErr);
    }
  } catch (err) {
    console.error("PROCESS REFERRAL ON JOB COMPLETE ERROR:", err);
  }
};

/* =========================================================
   KEPT FOR BACKWARDS COMPAT — no longer deducts commission
   Returns 0 always (settlement no longer uses discount logic)
========================================================= */
export const consumeReferralDiscount = async (_technicianId: string): Promise<number> => {
  return 0;
};
