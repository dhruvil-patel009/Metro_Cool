import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/**
 * ADMIN — Create Service
 */
export const createService = async (req: Request, res: Response) => {
  try {
    const {
      title,
      serviceCode,
      category,
      price,
      pricingType,
      description,
      imageUrl
    } = req.body;

    if (!title || !serviceCode || !category || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("services")
      .insert({
        title,
        service_code: serviceCode,
        category,
        price,
        pricing_type: pricingType || "fixed",
        description,
        image_url: imageUrl
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Service created successfully",
      service: data
    });
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — Update Service
 */
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("services")
      .update({
        ...req.body,
        updated_at: new Date()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Service updated",
      service: data
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — Enable / Disable Service
 */
export const toggleServiceStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const { data, error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    message: "Service status updated",
    service: data
  });
};

/**
 * ADMIN — Delete Service
 */
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Service deleted successfully" });
};

/**
 * PUBLIC — Get Active Services
 */
export const getActiveServices = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
};
