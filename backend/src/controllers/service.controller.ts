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
       originalPrice,
      pricingType,
      shortdescription,
      description,
      imageUrl,
       rating,
      badge,
      badgeColor,
    } = req.body || {};

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
        original_price: originalPrice,
        pricing_type: pricingType || "fixed",
        short_description: shortdescription,
        description,
        image_url: imageUrl,
        rating: rating ?? 4.5,
        badge,
        badge_color: badgeColor || "blue",
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    

    res.status(201).json({
      message: "Service created successfully",
      service: data,
    });

    console.log("BODY:", req.body);
console.log("FILE:", req.file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * ADMIN — Get ALL Services (Dashboard Table)
 */
export const getAllServicesAdmin = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
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

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

/**
 * ADMIN — Get Single Service
 */
export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Service not found" });

  res.json(data);
};

/**
 * ADMIN — Update Service
 */
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("services")
    .update({
      ...req.body,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    message: "Service updated",
    service: data,
  });
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

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    message: "Service status updated",
    service: data,
  });
};

/**
 * ADMIN — Delete Service
 */
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Service deleted successfully" });
};
