import { Request, Response } from "express"
import { supabase } from "../utils/supabase.js"

export const createOrder = async (req: Request, res: Response) => {

  try {

    const { items, customer_name, phone, address, total_amount } = req.body

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const user_id = req.user.id

    /* INSERT ORDER */

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id,
        customer_name,
        phone,
        street: address.street,
        city: address.city,
        zip: address.zip,
        total_amount
      })
      .select()
      .single()

    if (error) {
      console.log(error)
      return res.status(500).json({ error: "Order creation failed" })
    }

    /* INSERT ORDER ITEMS */

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      title: item.title,
      image: item.image,
      capacity: item.capacity,
      price: item.price,
      qty: item.qty
    }))

    await supabase
      .from("order_items")
      .insert(orderItems)

    res.json({
      success: true,
      order
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      error: "Order creation failed"
    })

  }

}
