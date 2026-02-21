// controllers/auth.controller.ts
import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailer.js";


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
        email: user.email
      }
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
    .select("id,email")
    .eq("email", email)
    .single();

  if (!user) return res.status(404).json({ error: "Email not registered" });

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-mpin/${resetToken}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset MPIN",
    html: `<h2>Reset your MPIN</h2>
           <a href="${resetLink}">Click here to reset MPIN</a>`
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
    secure: false, // true in production (HTTPS)
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};



