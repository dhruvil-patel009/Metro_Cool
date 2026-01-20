import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import { uploadFileToSupabase } from "../utils/uploadToSupabase.js";

/* ---------------- CREATE PRODUCT ---------------- */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      shortDesc,
      description,
      price,
      oldPrice,
      rating,
      reviewCount,
      badge,
      badgeColor,
      inStock,
      category,
      brand,
      capacity,
      specifications,
      features,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title & price required" });
    }

    const files = req.files as any;

    /* ---------- FILE UPLOADS ---------- */
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

    if (thumbnails.length < 3) {
      return res
        .status(400)
        .json({ error: "Minimum 3 thumbnail images required" });
    }

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

    /* ---------- INSERT PRODUCT ---------- */
    const { data, error } = await supabase
      .from("products")
      .insert({
        title,
        short_desc: shortDesc,
        description,
        price,
        old_price: oldPrice,
        rating,
        review_count: reviewCount,
        badge,
        badge_color: badgeColor,
        in_stock: inStock === "true",
        category,
        brand,
        capacity,

        specifications: specifications ? JSON.parse(specifications) : [],
        features: features ? JSON.parse(features) : [],

        main_image: mainImage,
        thumbnail_images: thumbnails,
        gallery_images: galleryImages,
        catalog_pdf: catalogPdf,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Product created successfully",
      product: data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
    console.log("Product not insert",err.message)
  }
};

/* ---------------- GET ALL ---------------- */
export const getProducts = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

/* ---------------- GET ONE ---------------- */
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

/* ---------------- UPDATE ---------------- */
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const payload = {
      ...req.body,
      specifications: req.body.specifications
        ? JSON.parse(req.body.specifications)
        : undefined,
      features: req.body.features
        ? JSON.parse(req.body.features)
        : undefined,
      updated_at: new Date(),
    };

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Product updated successfully",
      product: data,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Product deleted" });
};
