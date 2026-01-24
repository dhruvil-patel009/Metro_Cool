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


export const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const {
      serviceId,
      bookingDate,
      timeSlot,
      issues,
      instructions,
      address,
      pricing,
    } = req.body

    // 🔹 Fetch logged-in user details
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name, phone")
      .eq("id", req.user.id)
      .single()

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: req.user.id,
        service_id: serviceId,
        booking_date: bookingDate,
        time_slot: timeSlot,
        issues,
        instructions,
        full_name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
        address,
        service_price: pricing.serviceFee,
        estimated_parts: pricing.parts,
        tax: pricing.tax,
        total_amount: pricing.total,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      // unique_service_date constraint
      if (error.code === "23505") {
        return res.status(400).json({ message: "Date already booked" })
      }
      throw error
    }

    res.status(201).json({
      success: true,
      booking: data,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}


