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
  const { id } = req.params

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      service:services(*)
    `)
    .eq("id", id)
    .eq("user_id", req.user.id)
    .single()

  if (error || !data) {
    return res.status(404).json({ message: "Booking Not Found" })
  }

  res.json({ booking: data })
}

