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
    .gte("booking_date", startDate)
    .lt("booking_date", endDateStr)

  if (error) {
    return res.status(500).json({ message: error.message })
  }

  const dates = data.map(d => d.booking_date)

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

    const { data, error } = await supabase
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



