import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import crypto from "crypto";

/* =========================================================
   HELPER: Generate a unique 8-char referral code
========================================================= */
function generateReferralCode(firstName: string): string {
  const prefix = firstName.substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase().substring(0, 5);
  return `${prefix}${random}`;
}

/* =========================================================
   POST /api/referral/generate — Generate referral code for logged-in technician
========================================================= */
export const generateCode = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Check if technician already has an active referral code
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

    // Get technician name for code prefix
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", userId)
      .single();

    const firstName = profile?.first_name || "REF";

    // Generate unique code with retry
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

    // Insert the referral code
    const { data: newCode, error } = await supabase
      .from("referral_codes")
      .insert({
        technician_id: userId,
        code,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

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
   GET /api/referral/my-code — Get current technician's referral code
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

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.json({ referralCode: null, message: "No referral code generated yet" });
    }

    return res.json({
      referralCode: data.code,
      createdAt: data.created_at,
    });
  } catch (err) {
    console.error("GET MY CODE ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/validate/:code — Validate a referral code (public)
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

    if (error) {
      return res.status(500).json({ valid: false, error: error.message });
    }

    if (!data) {
      return res.json({ valid: false, message: "Invalid or expired referral code" });
    }

    // Get referrer name for display
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
      message: `Referred by ${referrerName}. You'll both benefit from this referral!`,
    });
  } catch (err) {
    console.error("VALIDATE CODE ERROR:", err);
    return res.status(500).json({ valid: false, error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/my-referrals — Get technician's referral history & rewards
========================================================= */
export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get all rewards where this technician is the referrer
    const { data: rewards, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Enrich with referred technician names
    const enrichedRewards = [];
    for (const reward of rewards || []) {
      const { data: referred } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", reward.referred_id)
        .single();

      enrichedRewards.push({
        id: reward.id,
        referredName: referred
          ? `${referred.first_name} ${referred.last_name}`.trim()
          : "Unknown",
        rewardType: reward.reward_type,
        rewardValue: reward.reward_value,
        rewardStatus: reward.reward_status,
        jobsRemaining: reward.jobs_remaining,
        createdAt: reward.created_at,
        expiresAt: reward.expires_at,
      });
    }

    return res.json({
      totalReferrals: enrichedRewards.length,
      activeRewards: enrichedRewards.filter((r) => r.rewardStatus === "active").length,
      referrals: enrichedRewards,
    });
  } catch (err) {
    console.error("GET MY REFERRALS ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   GET /api/referral/my-discount — Check if technician has active referral discount
   (Used by settlement system to apply discount)
========================================================= */
export const getMyDiscount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Find active rewards for this technician (as referrer)
    const { data: rewards, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_id", userId)
      .eq("reward_status", "active")
      .gt("jobs_remaining", 0);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!rewards || rewards.length === 0) {
      return res.json({ hasDiscount: false, totalDiscount: 0 });
    }

    // Sum up all active discount values
    const totalDiscount = rewards.reduce((sum, r) => sum + Number(r.reward_value), 0);

    return res.json({
      hasDiscount: true,
      totalDiscount,
      activeRewards: rewards.map((r) => ({
        id: r.id,
        rewardValue: r.reward_value,
        jobsRemaining: r.jobs_remaining,
        expiresAt: r.expires_at,
      })),
    });
  } catch (err) {
    console.error("GET MY DISCOUNT ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================================================
   INTERNAL: Consume one referral discount after a job completion
   Called from settlement/payment logic
========================================================= */
export const consumeReferralDiscount = async (technicianId: string): Promise<number> => {
  try {
    // Find the oldest active reward with remaining jobs
    const { data: reward, error } = await supabase
      .from("referral_rewards")
      .select("*")
      .eq("referrer_id", technicianId)
      .eq("reward_status", "active")
      .gt("jobs_remaining", 0)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !reward) return 0;

    const newJobsRemaining = reward.jobs_remaining - 1;
    const updateData: any = { jobs_remaining: newJobsRemaining };

    // If no jobs remaining, mark as used
    if (newJobsRemaining <= 0) {
      updateData.reward_status = "used";
    }

    await supabase
      .from("referral_rewards")
      .update(updateData)
      .eq("id", reward.id);

    return Number(reward.reward_value);
  } catch (err) {
    console.error("CONSUME REFERRAL DISCOUNT ERROR:", err);
    return 0;
  }
};
