import { supabase } from "../utils/supabase.js"
import { Request, Response } from "express"
import { RequestHandler } from "express"

export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", req.user.id)
      .order("is_default", { ascending: false })

    if (error) throw error

    res.json({ success: true, addresses: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id

    const {
      label,
      full_name,
      phone,
      street,
      apartment,
      city,
      state,
      postal_code,
      is_default,
    } = req.body

    // if default -> remove previous default
    if (is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", userId)
    }

    const { data, error } = await supabase
      .from("user_addresses")
      .insert({
        user_id: userId,
        label,
        full_name,
        phone,
        street,
        apartment,
        city,
        state,
        postal_code,
        is_default,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ success: true, address: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id
    const userId = req.user.id
    const body = req.body

    if (body.is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", userId)
    }

    const { data, error } = await supabase
      .from("user_addresses")
      .update(body)
      .eq("id", addressId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, address: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)

    if (error) throw error

    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const addressId = req.params.id
    const userId = req.user.id

    // remove previous default
    await supabase
      .from("user_addresses")
      .update({ is_default: false })
      .eq("user_id", userId)

    // set new default
    const { data, error } = await supabase
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, address: data })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}