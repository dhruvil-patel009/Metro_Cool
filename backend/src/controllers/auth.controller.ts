import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

const TEMP_OTP = process.env.TEMP_OTP || "123456";


/**
 * REGISTER (NO PASSWORD)
 */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      role,
      firstName,
      middleName,
      lastName,
      phone,
      email,
      experienceYears,
      promoCode
    } = req.body;

    if (!phone || !email || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Create Auth User
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        phone,
        email,
        email_confirm: true
      });

    if (authError || !authData?.user) {
      return res.status(400).json({ error: authError?.message });
    }

    const userId = authData.user.id;

    // 2️⃣ Read uploaded files
    const files = req.files as {
      profile_photo?: Express.Multer.File[];
      aadhaar_pan?: Express.Multer.File[];
    };

    const profileFile = files?.profile_photo?.[0];
    const aadhaarFile = files?.aadhaar_pan?.[0];

    let profilePhotoUrl: string | null = null;
    let aadhaarPanUrl: string | null = null;

    // 3️⃣ Upload Profile Photo
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
        return res.status(400).json({ error: "Profile photo upload failed" });
      }

      profilePhotoUrl = supabase.storage
        .from("secure-documents")
        .getPublicUrl(path).data.publicUrl;
    }

    // 4️⃣ Upload Aadhaar / PAN
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
        return res.status(400).json({ error: "Aadhaar/PAN upload failed" });
      }

      aadhaarPanUrl = supabase.storage
        .from("secure-documents")
        .getPublicUrl(path).data.publicUrl;
    }

    // 5️⃣ Insert Profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone,
        email,
        profile_photo: profilePhotoUrl
      })
      .select()
      .single();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // 6️⃣ Technician Details
    let technicianData = null;

    if (role === "technician") {
      const experienceMap: Record<string, number> = {
        "1-3": 1,
        "3-5": 3,
        "5+": 5
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
          is_verified: false
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      technicianData = data;
    }

    // 7️⃣ FINAL RESPONSE
    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: userId,
        role,
        phone,
        email
      },
      profile: profileData,
      technician: technicianData
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



/**
 * STEP 1 — LOGIN WITH PHONE (SEND OTP)
 */
export const loginWithPhone = async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone required" });
  }

  const { data:user } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("phone", phone)
    .single();

  if (!user) {
    return res.status(404).json({ error: "User not registered" });
  }

    const otp = TEMP_OTP; // DEV MODE


  res.json({
    message: "OTP sent (DEV MODE)",
    otp, 
    role: user.role
  });
};


/**
 * STEP 2 — VERIFY OTP & LOGIN (NO PASSWORD)
 */
export const verifyPhoneOtp = async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone & OTP required" });
  }

  if (otp !== TEMP_OTP) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

  // Fetch full user profile
  const { data: user , error } = await supabase
    .from("profiles")
    .select(`
      id,
      role,
      first_name,
      middle_name,
      last_name,
      phone,
      email,
      created_at
    `)
    .eq("phone", phone)
    .single();

  if (error || !user ) {
    return res.status(404).json({ error: "User not found" });
  }

  // 🔥 MOCK SESSION DATA (DEV MODE)
  const issuedAt = Math.floor(Date.now() / 1000); // now (seconds)
  const expiresIn = 60 * 60; // 1 hour
  const expiresAt = issuedAt + expiresIn;

  res.json({
    message: "Login successful (DEV MODE)",
    session: {
      accessToken: `dev-token-${user .id}`,
      refreshToken: `dev-refresh-${user .id}`,
      tokenType: "bearer",
      issuedAt,
      expiresIn,
      expiresAt
    },
    user: {
      id: user .id,
      role: user .role,
      firstName: user .first_name,
      middleName: user .middle_name,
      lastName: user .last_name,
      phone: user .phone,
      email: user .email,
      createdAt: user .created_at
    }
  });
};



