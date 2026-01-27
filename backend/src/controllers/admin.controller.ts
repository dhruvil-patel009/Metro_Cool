import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

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
    } = req.body

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

res.status(200).json(updatedProfile)  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Profile update failed" })
  }
}


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

export const createAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const {
      first_name,
      middle_name,
      last_name,
      phone,
      email,
      profile_photo,
    } = req.body

    // 1️⃣ Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      })

    if (authError || !authData.user) throw authError

    const userId = authData.user.id

    // 2️⃣ Insert profile with SAME id
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId, // ✅ THIS FIXES YOUR ERROR
        role: "admin",
        first_name,
        middle_name,
        last_name,
        phone,
        email,
        profile_photo,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create admin" })
  }
}


