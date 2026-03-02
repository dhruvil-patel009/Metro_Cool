import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import { uploadFileToSupabase } from "../utils/uploadToSupabase.js";

/* =========================================================
   CREATE PRODUCT
========================================================= */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      shortDesc,
      description,
      oldPrice,
      rating,
      reviewCount,
      badge,
      badgeColor,
      inStock,
      category,
      brand,
      specifications,
      features,
      capacityPrices, // <-- NEW
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    const files = req.files as any;

    /* ---------- Upload Files ---------- */

    const mainImage = files?.mainImage
      ? await uploadFileToSupabase(files.mainImage[0], "main")
      : null;

    const thumbnails = files?.thumbnail
      ? await Promise.all(
          files.thumbnail.map((f: any) =>
            uploadFileToSupabase(f, "thumbnail")
          )
        )
      : [];

    if (thumbnails.length < 3)
      return res.status(400).json({ error: "Minimum 3 thumbnails required" });

    const galleryImages = files?.gallery
      ? await Promise.all(
          files.gallery.map((f: any) =>
            uploadFileToSupabase(f, "gallery")
          )
        )
      : [];

    const catalogPdf = files?.catalog
      ? await uploadFileToSupabase(files.catalog[0], "catalog")
      : null;

    /* ---------- Parse JSON ---------- */
    let parsedCapacityPrices: any[] = [];
    if (capacityPrices) {
      try {
        parsedCapacityPrices = JSON.parse(capacityPrices);
      } catch {
        return res.status(400).json({ error: "Invalid capacityPrices JSON" });
      }
    }

    /* ---------- Base price (lowest capacity price) ---------- */
    const basePrice =
      parsedCapacityPrices.length > 0
        ? Math.min(...parsedCapacityPrices.map((c) => Number(c.price)))
        : 0;

    /* ---------- Insert ---------- */
    const { data, error } = await supabase
      .from("products")
      .insert({
        title,
        short_desc: shortDesc,
        description,
        price: basePrice, // shown in listing cards
        rating: Number(req.body.rating || 0),
        review_count: Number(req.body.reviewCount || 0),
        old_price: Number(req.body.oldPrice || 0),
        badge,
        badge_color: badgeColor,
        in_stock: inStock === "true",
        category,
        brand,
        specifications: specifications ? JSON.parse(specifications) : [],
        features: features ? JSON.parse(features) : [],
        capacity_prices: parsedCapacityPrices, // ⭐ MAIN CHANGE
        main_image: mainImage,
        thumbnail_images: thumbnails,
        gallery_images: galleryImages,
        catalog_pdf: catalogPdf,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Product created", product: data });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================================
   GET ALL PRODUCTS
========================================================= */
export const getProducts = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

/* =========================================================
   GET PRODUCT BY ID
========================================================= */
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Product not found" });

  res.json(data);
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let parsedCapacityPrices;
    if (req.body.capacityPrices) {
      parsedCapacityPrices = JSON.parse(req.body.capacityPrices);
    }

    const payload: any = {
      ...req.body,
      specifications: req.body.specifications
        ? JSON.parse(req.body.specifications)
        : undefined,
      features: req.body.features
        ? JSON.parse(req.body.features)
        : undefined,
      capacity_prices: parsedCapacityPrices,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Product updated", product: data });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* =========================================================
   DELETE
========================================================= */
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Product deleted" });
};