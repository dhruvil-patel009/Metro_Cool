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
      deliveryCharge, // <-- delivery charge per product
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

    /* ---------- Base price (lowest capacity price or manual) ---------- */
    const basePrice =
      parsedCapacityPrices.length > 0
        ? Math.min(...parsedCapacityPrices.map((c) => Number(c.price)))
        : Number(req.body.price || 0);

    /* ---------- Insert ---------- */
    const insertPayload: any = {
      title,
      short_desc: shortDesc,
      description,
      price: basePrice,
      rating: Number(req.body.rating || 0),
      review_count: Number(req.body.reviewCount || 0),
      old_price: Number(req.body.oldPrice || 0),
      delivery_charge: Number(deliveryCharge || 0),
      badge,
      badge_color: badgeColor,
      in_stock: inStock === "true",
      category,
      brand,
      specifications: specifications ? JSON.parse(specifications) : [],
      features: features ? JSON.parse(features) : [],
      main_image: mainImage,
      thumbnail_images: thumbnails,
      gallery_images: galleryImages,
      catalog_pdf: catalogPdf,
    }

    // Only include capacity_prices if data is provided (column may not exist in DB)
    if (parsedCapacityPrices.length > 0) {
      insertPayload.capacity_prices = parsedCapacityPrices
    }

    const { data, error } = await supabase
      .from("products")
      .insert(insertPayload)
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

  // Cache for 60s on CDN/browser — product list is public
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
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
    const files = req.files as any;

    /* ---------- Upload new files if provided ---------- */
    const mainImage = files?.mainImage
      ? await uploadFileToSupabase(files.mainImage[0], "main")
      : undefined;

    const thumbnails = files?.thumbnail
      ? await Promise.all(
          files.thumbnail.map((f: any) =>
            uploadFileToSupabase(f, "thumbnail")
          )
        )
      : undefined;

    const galleryImages = files?.gallery
      ? await Promise.all(
          files.gallery.map((f: any) =>
            uploadFileToSupabase(f, "gallery")
          )
        )
      : undefined;

    const catalogPdf = files?.catalog
      ? await uploadFileToSupabase(files.catalog[0], "catalog")
      : undefined;

    /* ---------- Parse JSON fields ---------- */
    let parsedCapacityPrices;
    if (req.body.capacityPrices) {
      try {
        parsedCapacityPrices = JSON.parse(req.body.capacityPrices);
      } catch {
        parsedCapacityPrices = req.body.capacityPrices;
      }
    }

    let parsedSpecs;
    if (req.body.specifications) {
      try {
        parsedSpecs = JSON.parse(req.body.specifications);
      } catch {
        parsedSpecs = req.body.specifications;
      }
    }

    let parsedFeatures;
    if (req.body.features) {
      try {
        parsedFeatures = JSON.parse(req.body.features);
      } catch {
        parsedFeatures = req.body.features;
      }
    }

    /* ---------- Existing images handling ---------- */
    let existingThumbnails;
    if (req.body.existing_thumbnails) {
      try {
        existingThumbnails = JSON.parse(req.body.existing_thumbnails);
      } catch {
        existingThumbnails = undefined;
      }
    }

    let existingGallery;
    if (req.body.existing_gallery) {
      try {
        existingGallery = JSON.parse(req.body.existing_gallery);
      } catch {
        existingGallery = undefined;
      }
    }

    // Merge existing + new images
    const finalThumbnails = thumbnails
      ? [...(existingThumbnails || []), ...thumbnails]
      : existingThumbnails;

    const finalGallery = galleryImages
      ? [...(existingGallery || []), ...galleryImages]
      : existingGallery;

    /* ---------- Build payload (whitelisted fields only) ---------- */
    const payload: any = {
      updated_at: new Date(),
    };

    // Text fields
    if (req.body.title !== undefined) payload.title = req.body.title;
    if (req.body.short_desc !== undefined) payload.short_desc = req.body.short_desc;
    if (req.body.description !== undefined) payload.description = req.body.description;
    if (req.body.brand !== undefined) payload.brand = req.body.brand;
    if (req.body.category !== undefined) payload.category = req.body.category;
    if (req.body.badge !== undefined) payload.badge = req.body.badge;
    if (req.body.badge_color !== undefined) payload.badge_color = req.body.badge_color;
    if (req.body.in_stock !== undefined) payload.in_stock = req.body.in_stock === "true" || req.body.in_stock === true;
    if (req.body.rating !== undefined) payload.rating = Number(req.body.rating);
    if (req.body.review_count !== undefined) payload.review_count = Number(req.body.review_count);
    if (req.body.old_price !== undefined) payload.old_price = Number(req.body.old_price);
    if (req.body.price !== undefined) payload.price = Number(req.body.price);
    if (req.body.delivery_charge !== undefined) payload.delivery_charge = Number(req.body.delivery_charge);

    // JSON fields
    if (parsedCapacityPrices) payload.capacity_prices = parsedCapacityPrices;
    if (parsedSpecs) payload.specifications = parsedSpecs;
    if (parsedFeatures) payload.features = parsedFeatures;

    // File fields
    if (mainImage) payload.main_image = mainImage;
    if (finalThumbnails) payload.thumbnail_images = finalThumbnails;
    if (finalGallery) payload.gallery_images = finalGallery;
    if (catalogPdf) payload.catalog_pdf = catalogPdf;

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Product updated", product: data });
  } catch (err: any) {
    console.log(err);
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