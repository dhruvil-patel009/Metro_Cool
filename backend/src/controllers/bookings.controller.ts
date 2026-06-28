import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"


export const getBookedDates = async (req: Request, res: Response) => {
  const { serviceId, month } = req.query
  // month = "2026-01"

  if (!serviceId || !month) {
    return res.status(400).json({ message: "Missing parameters" })
  }

  const startDate = `${month}-01`
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 1)

  const endDateStr = endDate.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("bookings")
    .select("booking_date")
    .eq("service_id", serviceId)
    .in("status", ["confirmed", "draft"]) // ✅ both confirmed AND draft block dates
    .gte("booking_date", startDate)
    .lt("booking_date", endDateStr)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  const dates = data.map(d =>
  new Date(d.booking_date).toISOString().split("T")[0]
) 

  res.setHeader("Cache-Control", "no-store")
  return res.json({
    success: true,
    dates,
  })

}

export const getAllBookings = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Check user role — only admins can see all bookings
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single()

    let query = supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        time_slot,
        full_name,
        phone,
        address,
        job_status,
        issues,
        instructions,
        service_id,
        services (
          id,
          title,
          image_url,
          price
        )
      `)
      .order("created_at", { ascending: false })

    // Non-admin users can only see their own bookings
    if (profile?.role !== "admin") {
      query = query.eq("user_id", req.user.id)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({
      success: true,
      bookings: data,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}


export const createBooking = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { serviceId, bookingDate, timeSlot } = req.body

    // fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("id", req.user.id)
      .eq("role", "user")
      .single()

    if (!profile) {
      return res.status(404).json({ message: "User not found" })
    }

    // ✅ Check for existing draft booking (same user + service + date)
    const { data: existingDraft } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", req.user.id)
      .eq("service_id", serviceId)
      .eq("booking_date", bookingDate)
      .eq("status", "draft")
      .maybeSingle()

    if (existingDraft) {
      // Return existing draft instead of failing on unique constraint
      return res.status(201).json({ success: true, booking: existingDraft })
    }

    // ✅ Clean up any stale draft bookings for this user + service (different date)
    await supabase
      .from("bookings")
      .delete()
      .eq("user_id", req.user.id)
      .eq("service_id", serviceId)
      .eq("status", "draft")

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: req.user.id,
        service_id: serviceId,
        booking_date: bookingDate,
        time_slot: timeSlot,
        status: "draft",
        full_name: `${profile.first_name} ${profile.last_name}`,
        phone: profile.phone,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({ message: "Date already booked" })
      }
      throw error
    }

    res.status(201).json({ success: true, booking: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}



export const completeBooking = async (req: any, res: Response) => {
  try {
    const bookingId = req.params.id

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { issues, instructions, address, pricing } = req.body

    const { data, error } = await supabase
      .from("bookings")
      .update({
        issues,
        instructions,
        address,
        service_price: pricing.serviceFee,
        estimated_parts: pricing.parts,
        tax: pricing.tax,
        total_amount: pricing.total,
        status: "confirmed",
      })
      .eq("id", bookingId)
      .eq("user_id", req.user.id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, booking: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const getBookingById = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const bookingId = req.params.id
    const userId = req.user.id

    /* ---------------- FETCH BOOKING ---------------- */
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", userId)
      .single()

    if (bookingError || !booking) {
      return res.status(404).json({ message: "Booking Not Found" })
    }

    /* ---------------- FETCH SERVICE ---------------- */
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, title, rating, price, image_url")
      .eq("id", booking.service_id)
      .single()

    if (serviceError || !service) {
      return res.status(404).json({ message: "Service Not Found" })
    }

    /* ---------------- FETCH USER PROFILE ---------------- */
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("phone, first_name, last_name")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({ message: "User profile not found" })
    }

    /* ---------------- FETCH TECHNICIAN ⭐ MAIN FIX ---------------- */
    let technician = null

    if (booking.technician_id) {
      const { data: tech, error: techError } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone,
          avatar
        `)
        .eq("id", booking.technician_id)
        .eq("role", "technician")
        .single()

      if (!techError && tech) {
        technician = {
          id: tech.id,
          full_name: `${tech.first_name} ${tech.last_name}`,
          phone: tech.phone,
          avatar: tech.avatar,
          experience_years: 3, // optional placeholder
        }
      }
    }

    /* ---------------- FINAL RESPONSE ---------------- */
    res.json({
      success: true,
      booking: {
        ...booking,
        service,
        technician,
        user: {
          full_name: `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone,
        },
      },
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const gettechnicianBookingById = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const bookingId = req.params.id

    // ✅ REMOVE user_id filter
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (error || !booking) {
      return res.status(404).json({ message: "Booking Not Found" })
    }

    // fetch customer profile
   const {
  data: profile,
  error: profileError,
} = await supabase
  .from("profiles")
  .select("phone, first_name, last_name")
  .eq("id", booking.user_id)
  .single()

    if (profileError || !profile) {
      return res.status(404).json({ message: "User profile not found" })
    }

    res.json({
      success: true,
      booking: {
        ...booking,
        user: {
          full_name: `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone,
        },
      },
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}


export const updateJobStatus = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const bookingId = req.params.id
    const { job_status } = req.body

    /* 1️⃣ update booking */
    const { data: booking, error } = await supabase
    .from("bookings")
    .update({
      job_status,
      technician_id: req.user.id
    })
    .eq("id", bookingId)
    .select()
    .single()
    

    if (error || !booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    /* 2️⃣ 🔔 SEND PUSH NOTIFICATION */

    res.json({
      success: true,
      booking
    })

  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

/* ======================================================
   ❌ CANCEL BOOKING (Customer)
   ====================================================== */

export const cancelBooking = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const bookingId = req.params.id
    const { cancellation_reason } = req.body

    if (!cancellation_reason) {
      return res.status(400).json({ message: "Cancellation reason is required" })
    }

    // Verify booking belongs to this user
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, job_status, user_id")
      .eq("id", bookingId)
      .eq("user_id", req.user.id)
      .maybeSingle()

    if (fetchError || !existing) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (existing.job_status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed booking" })
    }

    if (existing.job_status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" })
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        job_status: "cancelled",
        cancellation_reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: "customer",
      })
      .eq("id", bookingId)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, message: "Booking cancelled successfully", booking: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

// export const notifyBookingUpdate = async (booking: any) => {

//   if (!currentSubscription) {
//     console.log("No subscription available")
//     return
//   }

//   let message = ""

//   switch (booking.job_status) {
//     case "assigned":
//       message = "Technician assigned 👨‍🔧"
//       break
//     case "on_the_way":
//       message = "Technician is on the way 🚗"
//       break
//     case "working":
//       message = "Service started 🔧"
//       break
//     case "completed":
//       message = "Service completed 🎉"
//       break
//     default:
//       message = "Booking updated"
//   }

//   const payload = {
//     title: "Metro Cool Service Update",
//     body: message,
//     url: `https://www.metro-cool.com/bookings?id=${booking.id}`
//   }

//   await sendPush(currentSubscription, payload)
// }

