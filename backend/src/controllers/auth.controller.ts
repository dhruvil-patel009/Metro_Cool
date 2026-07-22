// controllers/auth.controller.ts
import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter, MAIL_FROM } from "../utils/mailer.js";


export const register = async (req: Request, res: Response) => {
  try {
    /* ======================================================
       1️⃣ BODY VALUES
    ====================================================== */
    const {
      role,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      mpin,   // ⭐ NEW
      experienceYears,
      promoCode,
      services // ⚠️ STRING from multipart/form-data
    } = req.body;

    /* ======================================================
       🔥 2️⃣ SERVICES PARSING (MANDATORY FOR SUPABASE)
    ====================================================== */
    let parsedServices: string[] | null = null;

    if (role === "technician") {
      if (!services) {
        return res.status(400).json({
          error: "Services are required for technician"
        });
      }

      try {
        parsedServices = JSON.parse(services); // 🔴 CRITICAL LINE
      } catch (err) {
        return res.status(400).json({
          error: "Invalid services format"
        });
      }

      if (!Array.isArray(parsedServices) || parsedServices.length === 0) {
        return res.status(400).json({
          error: "Services must be a non-empty array"
        });
      }
    }

    /* ======================================================
       3️⃣ BASIC VALIDATION
    ====================================================== */
    if (!phone || !email || !firstName || !lastName) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }
/* ======================================================
       3️⃣ MPIN VALIDATION
    ====================================================== */
    if (!mpin || !/^\d{4}$/.test(mpin)) {
      return res.status(400).json({
        error: "MPIN must be exactly 4 digits"
      });
    }

    /* ======================================================
       4️⃣ CREATE AUTH USER
    ====================================================== */
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        phone,
        email,
        email_confirm: true
      });

    if (authError || !authData?.user) {
      return res.status(400).json({
        error: authError?.message || "User creation failed"
      });
    }

    const userId = authData.user.id;

    /* ======================================================
       5️⃣ FILE HANDLING
    ====================================================== */
    const files = req.files as {
      profile_photo?: Express.Multer.File[];
      aadhaar_pan?: Express.Multer.File[];
    };

    const profileFile = files?.profile_photo?.[0];
    const aadhaarFile = files?.aadhaar_pan?.[0];

    let profilePhotoUrl: string | null = null;
    let aadhaarPanUrl: string | null = null;

    /* -------------------- PROFILE PHOTO -------------------- */
    if (profileFile) {
      const ext = profileFile.originalname.split(".").pop();
      const path = `profiles/${userId}.${ext}`;

      const { error } = await supabase.storage
        .from("secure-documents")
        .upload(path, profileFile.buffer, {
          contentType: profileFile.mimetype,
          upsert: true
        });

      if (error) {
        return res.status(400).json({
          error: "Profile photo upload failed"
        });
      }

      profilePhotoUrl = supabase.storage
        .from("secure-documents")
        .getPublicUrl(path).data.publicUrl;
    }

    /* -------------------- AADHAAR / PAN -------------------- */
    if (aadhaarFile) {
      const ext = aadhaarFile.originalname.split(".").pop();
      const path = `aadhaar_pan/${userId}.${ext}`;

      const { error } = await supabase.storage
        .from("secure-documents")
        .upload(path, aadhaarFile.buffer, {
          contentType: aadhaarFile.mimetype,
          upsert: true
        });

      if (error) {
        return res.status(400).json({
          error: "Aadhaar/PAN upload failed"
        });
      }

      aadhaarPanUrl = supabase.storage
        .from("secure-documents")
        .getPublicUrl(path).data.publicUrl;
    }

    const mpinHash = await bcrypt.hash(mpin, 10);
    /* ======================================================
       6️⃣ INSERT PROFILE
    ====================================================== */
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        phone,
        email,
        profile_photo: profilePhotoUrl,
        mpin_hash: mpinHash   // ⭐ NEW
      })
      .select()
      .single();

    if (profileError) {
      return res.status(400).json({
        error: profileError.message
      });
    }

    /* ======================================================
       7️⃣ TECHNICIAN DETAILS
    ====================================================== */
    let technicianData = null;

    if (role === "technician") {
      const experienceMap: Record<string, number> = {
        "0-1": 0,
        "1-3": 1,
        "3-5": 3,
        "5-10": 5,
        "10+": 10
      };

      const experienceYearsInt =
        experienceMap[experienceYears] ?? null;

      const { data, error } = await supabase
        .from("technician_details")
        .insert({
          id: userId,
          experience_years: experienceYearsInt,
          promo_code: promoCode || null,
          aadhaar_pan_url: aadhaarPanUrl,

          services: parsedServices, // 🔴 MUST BE ARRAY (TEXT[])

          approval_status: "pending",
          status: "inactive",
          is_verified: false
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({
          error: error.message
        });
      }

      technicianData = data;

      /* ======================================================
         7.5️⃣ REFERRAL REWARD — validate promo code & reward referrer
      ====================================================== */
      if (promoCode && promoCode.trim()) {
        const trimmedCode = promoCode.trim().toUpperCase();

        // Look up the referral code
        const { data: referralCode } = await supabase
          .from("referral_codes")
          .select("id, technician_id, is_active")
          .eq("code", trimmedCode)
          .eq("is_active", true)
          .maybeSingle();

        if (referralCode && referralCode.technician_id !== userId) {
          // Create reward for the referrer (5% commission discount for next 3 jobs)
          await supabase
            .from("referral_rewards")
            .insert({
              referrer_id: referralCode.technician_id,
              referred_id: userId,
              referral_code_id: referralCode.id,
              reward_type: "commission_discount",
              reward_value: 5,
              reward_status: "active",
              jobs_remaining: 3,
            });
        }
      }
    }

    /* ======================================================
       8️⃣ FINAL RESPONSE
    ====================================================== */
    return res.status(201).json({
      message:
        role === "technician"
          ? "Registered successfully. Profile under review."
          : "Registered successfully",

      user: {
        id: userId,
        role,
        phone,
        email
      },

      profile: profileData,
      technician: technicianData
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};



/**
 * STEP 1 — LOGIN WITH MPIN
 */
export const loginWithMpin = async (req: Request, res: Response) => {
  try {
    let { identifier, mpin } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!identifier || !mpin) {
      return res.status(400).json({
        error: "Phone/Email and MPIN required"
      });
    }

    // normalize
    identifier = String(identifier).trim().toLowerCase();
    mpin = String(mpin);

    if (!/^\d{4}$/.test(mpin)) {
      return res.status(400).json({
        error: "MPIN must be 4 digits"
      });
    }

    /* ---------------- FIND USER ---------------- */
    let query = supabase.from("profiles").select("*");

    // if only digits → phone login
    if (/^\d+$/.test(identifier)) {
      query = query.eq("phone", identifier);
    } else {
      // email login (case insensitive)
      query = query.ilike("email", identifier);
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* ---------------- MPIN CHECK ---------------- */
    const isMatch = await bcrypt.compare(mpin, user.mpin_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid MPIN" });
    }

    /* ---------------- JWT ---------------- */
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    /* ---------------- RESPONSE ---------------- */
    return res.json({
      message: "Login successful",
      accessToken: token,
      user: {
        id: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        email: user.email,
        profile_photo: user.profile_photo      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Forgot MPIN - send reset link to email (if email exists)

export const forgotMpin = async (req: Request, res: Response) => {
  const { email } = req.body;

  const { data: user } = await supabase
    .from("profiles")
    .select("id,email,first_name")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (!user) return res.status(404).json({ error: "Email not registered" });

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.FRONTEND_URL}/auth/reset-mpin/${resetToken}`;
  const firstName = user.first_name || "there";
  const year = new Date().getFullYear();

  await transporter.sendMail({
    from: MAIL_FROM,
    to: email,
    replyTo: process.env.MAIL_USER,
    subject: "Reset your MPIN – AC Marketplace",
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "Importance": "high",
    },
    // Plain-text fallback — critical for spam scoring
    text: `Hi ${firstName},

We received a request to reset the MPIN for your AC Marketplace account.

Click the link below to reset your MPIN (valid for 15 minutes):
${resetLink}

If you did not request this, please ignore this email. Your account remains secure.

Thanks,
The AC Marketplace Team`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your MPIN</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- MAIN CARD -->
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color:#0f172a;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">
                🔵 AC Marketplace
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 32px;border-radius:0 0 12px 12px;">

              <!-- Icon -->
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;background-color:#eff6ff;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;font-size:28px;">
                  🔐
                </div>
              </div>

              <h1 style="margin:0 0 8px;font-size:22px;font-weight:bold;color:#111827;text-align:center;">
                Reset your MPIN
              </h1>

              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;text-align:center;line-height:1.6;">
                Hi <strong style="color:#111827;">${firstName}</strong>, we received a request to reset the MPIN
                for your AC Marketplace account. This link is valid for <strong>15 minutes</strong>.
              </p>

              <!-- CTA BUTTON -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${resetLink}"
                       style="display:inline-block;background-color:#2563eb;color:#ffffff;
                              text-decoration:none;font-size:16px;font-weight:bold;
                              padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">
                      Reset My MPIN
                    </a>
                  </td>
                </tr>
              </table>

              <!-- DIVIDER -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

              <!-- SECURITY NOTE -->
              <p style="margin:0 0 16px;font-size:13px;color:#6b7280;line-height:1.6;">
                🔒 <strong>Didn't request this?</strong> You can safely ignore this email.
                Your account has not been changed.
              </p>

              <!-- FALLBACK URL -->
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                If the button doesn't work, paste this URL into your browser:<br />
                <a href="${resetLink}" style="color:#2563eb;word-break:break-all;">${resetLink}</a>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${year} AC Marketplace · Ahmedabad, India<br />
                This is an automated message — please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  });

  res.json({ message: "Reset link sent to email" });
};

// Reset MPIN - verify token and update MPIN hash
export const resetMpin = async (req: Request, res: Response) => {
  const { token, mpin } = req.body;

  if (!/^\d{4}$/.test(mpin))
    return res.status(400).json({ error: "MPIN must be 4 digits" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const newHash = await bcrypt.hash(mpin, 10);

    await supabase
      .from("profiles")
      .update({ mpin_hash: newHash })
      .eq("id", decoded.id);

    res.json({ message: "MPIN reset successful" });
  } catch {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

/**
 * LOGOUT (ALL ROLES)
 */
export const logout = async (_req: Request, res: Response) => {
    // 🔹 If you later store refresh tokens in DB,
    // you can invalidate them here.

    // 🔹 If using cookies (recommended for prod)
    res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};



