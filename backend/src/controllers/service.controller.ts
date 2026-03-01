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


/**
 * Get Service Details Public
 */
export const getServiceDetailsPublic = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(data);
};

/**
 * Get Service Details
 */
export const getServiceDetails = async (req: Request, res: Response) => {
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
 * Get Service Includes
 */

// export const getServiceIncludes = async (req: Request, res: Response) => {
//   const { type } = req.params;

//   const { data } = await supabase
//     .from("service_includes")
//     .select("*")
//     .eq("service_type", type);

//   res.json(data);
// };


/**
 * Get Service Faqs
 */

// export const getServiceFaqs = async (req: Request, res: Response) => {
//   const { type } = req.params;

//   const { data } = await supabase
//     .from("service_faqs")
//     .select("*")
//     .eq("service_type", type);

//   res.json(data);
// };


/**
 * Get Service Addons
 */ 

// export const getServiceAddons = async (req: Request, res: Response) => {
//   const { type } = req.params;

//   const { data } = await supabase
//     .from("service_addons")
//     .select("*")
//     .eq("service_type", type);

//   res.json(data);
// };

/**
 * Like Services
 */ 
export const likeService = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  await supabase
    .from("service_likes")
    .insert({ service_id: id, user_id: userId });

  res.json({ success: true });
};


/**
 * PUBLIC — Get Single Active Service (For Frontend)
 */
export const getPublicServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(data);
};



export const getFullServiceDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    /* 1️⃣ MAIN SERVICE */
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (serviceError || !service) {
      return res.status(404).json({ error: "Service not found" });
    }

    /* 2️⃣ WHAT'S INCLUDED */
    const { data: includes } = await supabase
      .from("service_includes")
      .select("*")
      .eq("service_id", id)
      .order("created_at");

    /* 3️⃣ ADDONS */
    const { data: addons } = await supabase
      .from("service_addons")
      .select("*")
      .eq("service_id", id)
      .order("created_at");

    /* 4️⃣ FAQ */
    const { data: faqs } = await supabase
      .from("service_faqs")
      .select("*")
      .eq("service_id", id)
      .order("created_at");

    res.json({
      service,
      includes,
      addons,
      faqs,
    });

  } catch (err) {
    console.error("SERVICE DETAILS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
};