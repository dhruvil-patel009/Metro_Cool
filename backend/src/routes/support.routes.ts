import { Router } from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { supabase } from "../utils/supabase.js"

const router = Router()

/* ── GET /api/support/tickets — get user's support tickets ── */
router.get("/tickets", protect, async (req: any, res) => {
  try {
    const userId = req.user.id

    // Check if admin — admins see all tickets
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    let query = supabase
      .from("support_tickets")
      .select("*, profiles(first_name, last_name, phone, email, role)")
      .order("created_at", { ascending: false })

    // Non-admins only see their own tickets
    if (profile?.role !== "admin") {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ success: true, tickets: data || [] })
  } catch (err) {
    console.error("Get tickets error:", err)
    res.status(500).json({ error: "Failed to load tickets" })
  }
})

/* ── POST /api/support/tickets — create a new support ticket ── */
router.post("/tickets", protect, async (req: any, res) => {
  try {
    const userId = req.user.id
    const { subject, description, category } = req.body

    if (!subject || !description) {
      return res.status(400).json({ error: "Subject and description are required" })
    }

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: userId,
        subject,
        description,
        category: category || "general",
        status: "open",
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, ticket: data })
  } catch (err) {
    console.error("Create ticket error:", err)
    res.status(500).json({ error: "Failed to create ticket" })
  }
})

/* ── GET /api/support/tickets/:id — get single ticket details ── */
router.get("/tickets/:id", protect, async (req: any, res) => {
  try {
    const userId = req.user.id
    const ticketId = req.params.id

    // Check if admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    let query = supabase
      .from("support_tickets")
      .select("*, profiles(first_name, last_name, phone, email, role)")
      .eq("id", ticketId)

    // Non-admins can only see their own
    if (profile?.role !== "admin") {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    res.json({ success: true, ticket: data })
  } catch (err) {
    console.error("Get ticket error:", err)
    res.status(500).json({ error: "Failed to load ticket" })
  }
})

/* ── PATCH /api/support/tickets/:id — admin update ticket status ── */
router.patch("/tickets/:id", protect, async (req: any, res) => {
  try {
    const userId = req.user.id
    const ticketId = req.params.id
    const { status, admin_note } = req.body

    // Verify admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()

    if (profile?.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update ticket status" })
    }

    const validStatuses = ["open", "in_progress", "resolved", "closed"]
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (admin_note !== undefined) updateData.admin_note = admin_note

    const { data, error } = await supabase
      .from("support_tickets")
      .update(updateData)
      .eq("id", ticketId)
      .select("*, profiles(first_name, last_name, phone, email, role)")
      .single()

    if (error) throw error

    res.json({ success: true, ticket: data })
  } catch (err) {
    console.error("Update ticket error:", err)
    res.status(500).json({ error: "Failed to update ticket" })
  }
})

export default router
