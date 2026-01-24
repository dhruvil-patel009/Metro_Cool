import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

/**
 * CREATE SERVICE FEEDBACK
 * Only logged-in users (role=user) can submit
 * RLS enforces user_id = auth.uid()
 */
export const createServiceFeedback = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const userId = req.user.id
    const {
      booking_id,
      service_id,
      rating,
      tags,
      comment,
    } = req.body

    if (!booking_id || !service_id || !rating) {
      return res.status(400).json({
        message: "booking_id, service_id and rating are required",
      })
    }

    const { data, error } = await supabase
      .from("service_feedbacks")
      .insert([
        {
          booking_id,
          user_id: userId,
          service_id,
          rating,
          tags,
          comment,
        },
      ])
      .select()
      .single()

    if (error) {
      return res.status(400).json({
        message: error.message,
      })
    }

    res.status(201).json({
      success: true,
      feedback: data,
    })
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    })
  }
}

/**
 * GET FEEDBACK BY BOOKING ID
 * User can only access their own feedback (RLS)
 */
export const getFeedbackByBookingId = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const bookingId = req.params.bookingId

    const { data, error } = await supabase
      .from("service_feedbacks")
      .select("*")
      .eq("booking_id", bookingId)
      .single()

    if (error || !data) {
      return res.status(404).json({
        message: "Feedback not found",
      })
    }

    res.json({
      success: true,
      feedback: data,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}
