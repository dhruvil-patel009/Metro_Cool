import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import bcrypt from "bcrypt";


/* ================= GET ALL TECHNICIANS (PAGINATED) ================= */

export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await supabase
      .from("technician_details")
      .select(
        `
        id,
        services,
        status,
        approval_status,
        experience_years,
        profiles!technician_details_id_fkey  (
          first_name,
          last_name,
          phone,
          email,
          profile_photo
        )
      `,
        { count: "exact" }
      )
      .range(from, to);

    if (error) {
      console.log("supabase Error:", error)
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data,
      total: count ?? 0,
      // page,
      // limit,
    });
  } catch (err) {
    console.error("GET TECHNICIANS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTechnicianStats = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("technician_details")
      .select("status, approval_status");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const technicians = data ?? [];

    res.json({
      total: technicians.length,
      active: technicians.filter(t => t.status === "active").length,
      inactive: technicians.filter(t => t.status === "inactive").length,
      pending: technicians.filter(t => t.approval_status === "pending").length,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= GET PENDING TECHNICIAN REQUESTS ================= */

export const getPendingRequests = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("technician_details")
      .select(
        `
        id,
        services,
        experience_years,
        profiles!technician_details_id_fkey(
          first_name,
          last_name,
          phone,
          email,
          profile_photo
        )
      `
      )
      .eq("approval_status", "pending");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("GET PENDING REQUESTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ================= APPROVE TECHNICIAN ================= */

export const approveTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({
      approval_status: "approved",
      status: "active",
    })
    .eq("id", req.params.id);

  res.json({ message: "Approved" });
};

/* ================= REJECT TECHNICIAN ================= */

export const rejectTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({
      approval_status: "rejected",
      status: "inactive",
    })
    .eq("id", req.params.id);

  res.json({ message: "Rejected" });
};

/* ================= DEACTIVATE TECHNICIAN ================= */

export const deactivateTechnician = async (req: Request, res: Response) => {
  await supabase
    .from("technician_details")
    .update({ status: "inactive" })
    .eq("id", req.params.id);

  res.json({ message: "Deactivated" });
};



// GET /admin/technicians/:id
// controllers/admin.controller.ts
export const getTechnicianById = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log("Request technician id:", req.params.id)
  const { data, error } = await supabase
    .from("technician_details")
    .select(`
      id,
      status,
      approval_status,
      experience_years,
      promo_code,
      services,
      aadhaar_pan_url,
            created_at,
      profiles!technician_details_id_fkey  (
        first_name,
        middle_name,
        last_name,
        phone,
        email,
        profile_photo,
              created_at
      )
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error(error)
    return res.status(404).json({ message: "Technician not found" })
  }

  res.json(data)
}



// UPDATE
export const updateTechnician = async (req: Request, res: Response) => {
  const { services, status } = req.body;

  await supabase
    .from("technician_details")
    .update({ services, status })
    .eq("id", req.params.id);

  res.json({ message: "Technician updated" });
};

// DELETE
export const deleteTechnician = async (req: Request, res: Response) => {
  await supabase.from("technician_details").delete().eq("id", req.params.id);
  await supabase.from("profiles").delete().eq("id", req.params.id);

  res.json({ message: "Technician deleted" });
};


////////////////////////////////////////////////// Users //////////////////////////////////////////
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, count, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        first_name,
        last_name,
        phone,
        email,
        profile_photo,
        created_at
      `,
        { count: "exact" }
      )
      .eq("role", "user")
      .range(from, to)
      .order("created_at", { ascending: false })

    if (error) {
      console.log("SUPABASE ERROR:", error)
      return res.status(400).json({ error: error.message })
    }

    res.json({
      data,
      total: count ?? 0,
    })
  } catch (err) {
    console.error("GET USERS ERROR:", err)
    res.status(500).json({ error: "Server error" })
  }
}


export const getUserStats = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("status")
      .eq("role", "user")

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    const users = data ?? []

    res.json({
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      inactive: users.filter(u => u.status === "inactive").length,
    })
  } catch {
    res.status(500).json({ error: "Server error" })
  }
}


export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      first_name,
      middle_name,
      last_name,
      phone,
      email,
      profile_photo,
      status,
      created_at
    `)
    .eq("id", id)
    .eq("role", "user")
    .single()

  if (error || !data) {
    return res.status(404).json({ message: "User not found" })
  }

  res.json(data)
}


export const updateUser = async (req: Request, res: Response) => {
  const { first_name, last_name, phone, status } = req.body

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      phone,
      status,
    })
    .eq("id", req.params.id)
    .eq("role", "user")

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: "User updated" })
}


export const deleteUser = async (req: Request, res: Response) => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", req.params.id)
    .eq("role", "user")

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: "User deleted" })
}


export const toggleUserStatus = async (req: Request, res: Response) => {
  const { status } = req.body // active | inactive

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", req.params.id)
    .eq("role", "user")

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: "Status updated" })
}


/////////////////////////////////////////////////// Admin Profile ///////////////////////////////////////


export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const userId = req.user.id

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        email,
        profile_photo,
        role
      `)
      .eq("id", userId)
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to load profile" })
  }
}

/////////////////////////////////////////////////// UPDATE PROFILE + CHANGE MPIN ///////////////////////////////////////

export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const userId = req.user.id

    const {
      first_name,
      middle_name,
      last_name,
      phone,
      email,
      profile_photo,
      mpin, // ⭐ NEW (optional)
    } = req.body

    // 1️⃣ Update profile table
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name,
        middle_name,
        last_name,
        phone,
        email,
        profile_photo,
        updated_at: new Date(),
      })
      .eq("id", userId)

    if (error) throw error

    // 2️⃣ If MPIN provided → update Supabase password
    if (mpin) {
      if (mpin.length !== 4) {
        return res.status(400).json({ error: "MPIN must be 4 digits" })
      }

      const { error: passwordError } =
        await supabase.auth.admin.updateUserById(userId, {
          password: mpin,
        })

      if (passwordError) throw passwordError
    }

    // 3️⃣ Return updated profile
    const { data: updatedProfile } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        email,
        profile_photo,
        role
      `)
      .eq("id", userId)
      .single()

    res.status(200).json(updatedProfile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Profile update failed" })
  }
}

/////////////////////////////////////////////////// GET ADMINS ///////////////////////////////////////

export const getAdmins = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const currentUserId = req.user.id

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        profile_photo,
        role
      `)
      .eq("role", "admin")
      .order("created_at")

    if (error) throw error

    const admins = data.map((a) => ({
      id: a.id,
      name: `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim(),
      email: a.email,
      phone: a.phone,
      role: a.role,
      avatar: a.profile_photo,
      status: a.id === currentUserId ? "current" : "active",
      isCurrent: a.id === currentUserId,
    }))

    res.json({ data: admins })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch admins" })
  }
}

/////////////////////////////////////////////////// CREATE ADMIN (WITH MPIN) ///////////////////////////////////////

export const createAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      first_name,
      middle_name,
      last_name,
      phone,
      email,
      profile_photo,
      mpin,
    } = req.body;

    /* ---------------- MPIN VALIDATION ---------------- */
    if (!mpin || !/^\d{4}$/.test(mpin)) {
      return res.status(400).json({
        error: "MPIN must be exactly 4 digits",
      });
    }

    /* ---------------- DUPLICATE CHECK ---------------- */
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    /* ---------------- CREATE AUTH USER (ONLY FOR ID) ---------------- */
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

    if (authError || !authData?.user) {
      return res.status(400).json({
        error: authError?.message || "Failed to create user",
      });
    }

    const userId = authData.user.id;

    /* ---------------- HASH MPIN ---------------- */
    const mpinHash = await bcrypt.hash(mpin, 10);

    /* ---------------- INSERT PROFILE ---------------- */
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role: "admin",
        first_name,
        middle_name,
        last_name,
        phone,
        email,
        profile_photo,
        mpin_hash: mpinHash,   // ⭐ CRITICAL
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: "Admin created successfully",
      admin: data,
    });

  } catch (err) {
    console.error("CREATE ADMIN ERROR:", err);
    return res.status(500).json({ error: "Failed to create admin" });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { adminId } = req.params;

    // prevent self delete
    if (adminId === req.user.id) {
      return res.status(400).json({
        error: "You cannot delete your own account",
      });
    }

    /* ---------------- 1️⃣ DELETE PROFILE ---------------- */
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", adminId);

    if (profileError) throw profileError;

    /* ---------------- 2️⃣ DELETE AUTH USER (CRITICAL) ---------------- */
    const { error: authError } =
      await supabase.auth.admin.deleteUser(adminId);

    if (authError) throw authError;

    return res.json({ message: "Admin removed successfully" });

  } catch (err) {
    console.error("DELETE ADMIN ERROR:", err);
    return res.status(500).json({ error: "Failed to delete admin" });
  }
};