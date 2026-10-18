import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import { uploadFileToSupabase } from "../utils/uploadToSupabase.js";

/* =========================================================
   GENERATE SIGNED UPLOAD URL (Bypasses Vercel 4.5MB limit)
========================================================= */
export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, folder = "catalog" } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }

    const allowedFolders = ["main", "thumbnail", "gallery", "catalog"];
    const targetFolder = allowedFolders.includes(folder) ? folder : "catalog";

    // Clean filename
    const ext = fileName.includes(".") ? fileName.split(".").pop() : "";
    const nameWithoutExt = fileName.includes(".")
      ? fileName.substring(0, fileName.lastIndexOf("."))
      : fileName;
    const cleanBase = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = `${targetFolder}/${Date.now()}-${cleanBase}${ext ? `.${ext}` : ""}`;

    const { data, error } = await supabase.storage
      .from("products")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Supabase createSignedUploadUrl error:", error);
      return res.status(500).json({ error: error.message });
    }

    const { data: pubData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    res.json({
      signedUrl: data.signedUrl,
      token: data.token,
      filePath,
      publicUrl: pubData.publicUrl,
    });
  } catch (err: any) {
    console.error("Error in getUploadUrl:", err);
    res.status(500).json({ error: err.message || "Failed to generate upload URL" });
  }
};

/* =========================================================
   CREATE PRODUCT
========================================================= */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      shortDesc,
      short_desc,
      description,
      oldPrice,
      old_price,
      rating,
      reviewCount,
      review_count,
      badge,
      badgeColor,
      badge_color,
      inStock,
      in_stock,
      category,
      brand,
      specifications,
      features,
      capacityPrices,
      capacity_prices,
      deliveryCharge,
      delivery_charge,
      fastInstallation,
      fast_installation,
      installation_within,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title required" });
    }

    const files = req.files as any;

    /* ---------- Upload / Resolve Main Image ---------- */
    let mainImage: string | null = null;
    if (files?.mainImage) {
      mainImage = await uploadFileToSupabase(files.mainImage[0], "main");
    } else if (req.body.main_image || req.body.mainImage) {
      mainImage = req.body.main_image || req.body.mainImage;
    }

    /* ---------- Upload / Resolve Thumbnails ---------- */
    let thumbnails: string[] = [];
    if (files?.thumbnail) {
      thumbnails = await Promise.all(
        files.thumbnail.map((f: any) =>
          uploadFileToSupabase(f, "thumbnail")
        )
      );
    } else if (req.body.thumbnail_images || req.body.thumbnail) {
      const rawThumb = req.body.thumbnail_images || req.body.thumbnail;
      if (Array.isArray(rawThumb)) {
        thumbnails = rawThumb;
      } else if (typeof rawThumb === "string") {
        try {
          thumbnails = JSON.parse(rawThumb);
        } catch {
          thumbnails = [rawThumb];
        }
      }
    }

    if (thumbnails.length < 3)
      return res.status(400).json({ error: "Minimum 3 thumbnails required" });

    /* ---------- Upload / Resolve Gallery Images ---------- */
    let galleryImages: string[] = [];
    if (files?.gallery) {
      galleryImages = await Promise.all(
        files.gallery.map((f: any) =>
          uploadFileToSupabase(f, "gallery")
        )
      );
    } else if (req.body.gallery_images || req.body.gallery) {
      const rawGal = req.body.gallery_images || req.body.gallery;
      if (Array.isArray(rawGal)) {
        galleryImages = rawGal;
      } else if (typeof rawGal === "string") {
        try {
          galleryImages = JSON.parse(rawGal);
        } catch {
          galleryImages = [rawGal];
        }
      }
    }

    /* ---------- Upload / Resolve Catalog PDF ---------- */
    let catalogPdf: string | null = null;
    if (files?.catalog) {
      catalogPdf = await uploadFileToSupabase(files.catalog[0], "catalog");
    } else if (req.body.catalog_pdf || req.body.catalog) {
      catalogPdf = req.body.catalog_pdf || req.body.catalog;
    }

    /* ---------- Parse Capacity Prices ---------- */
    const rawCapacity = capacityPrices || capacity_prices;
    let parsedCapacityPrices: any[] = [];
    if (rawCapacity) {
      if (Array.isArray(rawCapacity)) {
        parsedCapacityPrices = rawCapacity;
      } else {
        try {
          parsedCapacityPrices = JSON.parse(rawCapacity);
        } catch {
          return res.status(400).json({ error: "Invalid capacityPrices JSON" });
        }
      }
    }

    /* ---------- Base price (lowest capacity price or manual) ---------- */
    const validPrices = parsedCapacityPrices
      .map((c) => Number(c.price))
      .filter((p) => !isNaN(p) && p > 0);

    const basePrice =
      validPrices.length > 0
        ? Math.min(...validPrices)
        : Number(req.body.price || 0);

    /* ---------- Parse Specs & Features ---------- */
    let parsedSpecs: any[] = [];
    if (specifications) {
      if (Array.isArray(specifications)) parsedSpecs = specifications;
      else {
        try { parsedSpecs = JSON.parse(specifications); } catch { parsedSpecs = []; }
      }
    }

    let parsedFeatures: any[] = [];
    if (features) {
      if (Array.isArray(features)) parsedFeatures = features;
      else {
        try { parsedFeatures = JSON.parse(features); } catch { parsedFeatures = []; }
      }
    }

    /* ---------- Insert ---------- */
    const finalInStock = in_stock !== undefined
      ? in_stock === "true" || in_stock === true
      : inStock === "true" || inStock === true;

    const finalFastInstallation = fast_installation !== undefined
      ? fast_installation === "true" || fast_installation === true
      : fastInstallation === "true" || fastInstallation === true;

    const insertPayload: any = {
      title,
      short_desc: short_desc || shortDesc || null,
      description: description || null,
      price: basePrice,
      rating: Number(rating || 0),
      review_count: Number(review_count || reviewCount || 0),
      old_price: Number(old_price || oldPrice || 0),
      delivery_charge: Number(delivery_charge || deliveryCharge || 0),
      badge: badge || null,
      badge_color: badge_color || badgeColor || "#3b82f6",
      in_stock: finalInStock,
      fast_installation: finalFastInstallation,
      category: category || null,
      brand: brand || null,
      specifications: parsedSpecs,
      features: parsedFeatures,
      main_image: mainImage,
      thumbnail_images: thumbnails,
      thumbnail_image: thumbnails[0] || null,
      gallery_images: galleryImages,
      catalog_pdf: catalogPdf,
    };

    if (installation_within !== undefined) {
      insertPayload.installation_within = installation_within?.trim() || null;
    }

    if (parsedCapacityPrices.length > 0) {
      insertPayload.capacity_prices = parsedCapacityPrices;
    }

    const { data, error } = await supabase
      .from("products")
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Product created", product: data });
  } catch (err: any) {
    console.error("createProduct error:", err);
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
      : (req.body.main_image !== undefined ? req.body.main_image : (req.body.mainImage !== undefined ? req.body.mainImage : undefined));

    let thumbnails = files?.thumbnail
      ? await Promise.all(
          files.thumbnail.map((f: any) =>
            uploadFileToSupabase(f, "thumbnail")
          )
        )
      : undefined;

    if (!thumbnails && (req.body.new_thumbnails || req.body.newThumbnails)) {
      const raw = req.body.new_thumbnails || req.body.newThumbnails;
      try {
        thumbnails = Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch {
        thumbnails = [raw];
      }
    }

    let galleryImages = files?.gallery
      ? await Promise.all(
          files.gallery.map((f: any) =>
            uploadFileToSupabase(f, "gallery")
          )
        )
      : undefined;

    if (!galleryImages && (req.body.new_gallery || req.body.newGallery)) {
      const raw = req.body.new_gallery || req.body.newGallery;
      try {
        galleryImages = Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch {
        galleryImages = [raw];
      }
    }

    const catalogPdf = files?.catalog
      ? await uploadFileToSupabase(files.catalog[0], "catalog")
      : (req.body.catalog_pdf !== undefined ? req.body.catalog_pdf : (req.body.catalog !== undefined ? req.body.catalog : undefined));

    /* ---------- Complete arrays if provided in JSON ---------- */
    let completeThumbnails: string[] | undefined = undefined;
    if (req.body.thumbnail_images !== undefined || req.body.thumbnailImages !== undefined) {
      const raw = req.body.thumbnail_images !== undefined ? req.body.thumbnail_images : req.body.thumbnailImages;
      try {
        completeThumbnails = Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch {
        completeThumbnails = [raw];
      }
    }

    let completeGallery: string[] | undefined = undefined;
    if (req.body.gallery_images !== undefined || req.body.galleryImages !== undefined) {
      const raw = req.body.gallery_images !== undefined ? req.body.gallery_images : req.body.galleryImages;
      try {
        completeGallery = Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch {
        completeGallery = [raw];
      }
    }

    /* ---------- Parse JSON fields ---------- */
    let parsedCapacityPrices;
    if (req.body.capacityPrices || req.body.capacity_prices) {
      const raw = req.body.capacityPrices || req.body.capacity_prices;
      try {
        parsedCapacityPrices = Array.isArray(raw) ? raw : JSON.parse(raw);
      } catch {
        parsedCapacityPrices = raw;
      }
    }

    let parsedSpecs;
    if (req.body.specifications) {
      try {
        parsedSpecs = Array.isArray(req.body.specifications) ? req.body.specifications : JSON.parse(req.body.specifications);
      } catch {
        parsedSpecs = req.body.specifications;
      }
    }

    let parsedFeatures;
    if (req.body.features) {
      try {
        parsedFeatures = Array.isArray(req.body.features) ? req.body.features : JSON.parse(req.body.features);
      } catch {
        parsedFeatures = req.body.features;
      }
    }

    /* ---------- Existing images handling ---------- */
    let existingThumbnails;
    if (req.body.existing_thumbnails) {
      try {
        existingThumbnails = Array.isArray(req.body.existing_thumbnails)
          ? req.body.existing_thumbnails
          : JSON.parse(req.body.existing_thumbnails);
      } catch {
        existingThumbnails = undefined;
      }
    }

    let existingGallery;
    if (req.body.existing_gallery) {
      try {
        existingGallery = Array.isArray(req.body.existing_gallery)
          ? req.body.existing_gallery
          : JSON.parse(req.body.existing_gallery);
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
    else if (req.body.shortDesc !== undefined) payload.short_desc = req.body.shortDesc;
    if (req.body.description !== undefined) payload.description = req.body.description;
    if (req.body.brand !== undefined) payload.brand = req.body.brand;
    if (req.body.category !== undefined) payload.category = req.body.category;
    if (req.body.badge !== undefined) payload.badge = req.body.badge;
    if (req.body.badge_color !== undefined) payload.badge_color = req.body.badge_color;
    else if (req.body.badgeColor !== undefined) payload.badge_color = req.body.badgeColor;
    if (req.body.in_stock !== undefined) payload.in_stock = req.body.in_stock === "true" || req.body.in_stock === true;
    else if (req.body.inStock !== undefined) payload.in_stock = req.body.inStock === "true" || req.body.inStock === true;
    if (req.body.fast_installation !== undefined) payload.fast_installation = req.body.fast_installation === "true" || req.body.fast_installation === true;
    else if (req.body.fastInstallation !== undefined) payload.fast_installation = req.body.fastInstallation === "true" || req.body.fastInstallation === true;
    if (req.body.rating !== undefined) payload.rating = Number(req.body.rating);
    if (req.body.review_count !== undefined) payload.review_count = Number(req.body.review_count);
    else if (req.body.reviewCount !== undefined) payload.review_count = Number(req.body.reviewCount);
    if (req.body.old_price !== undefined) payload.old_price = Number(req.body.old_price);
    else if (req.body.oldPrice !== undefined) payload.old_price = Number(req.body.oldPrice);

    if (parsedCapacityPrices && parsedCapacityPrices.length > 0) {
      const validPrices = parsedCapacityPrices
        .map((c: any) => Number(c.price))
        .filter((p: number) => !isNaN(p) && p > 0);
      if (validPrices.length > 0) {
        payload.price = Math.min(...validPrices);
      } else if (req.body.price !== undefined) {
        payload.price = Number(req.body.price);
      }
    } else if (req.body.price !== undefined) {
      payload.price = Number(req.body.price);
    }

    if (req.body.delivery_charge !== undefined) payload.delivery_charge = Number(req.body.delivery_charge);
    else if (req.body.deliveryCharge !== undefined) payload.delivery_charge = Number(req.body.deliveryCharge);

    // installation_within: empty string → set to null (inherit global), otherwise store value
    if (req.body.installation_within !== undefined) {
      payload.installation_within = req.body.installation_within?.trim() || null;
    }

    // JSON fields
    if (parsedCapacityPrices !== undefined) payload.capacity_prices = parsedCapacityPrices;
    if (parsedSpecs !== undefined) payload.specifications = parsedSpecs;
    if (parsedFeatures !== undefined) payload.features = parsedFeatures;

    // File fields
    if (mainImage !== undefined) payload.main_image = mainImage;

    if (completeThumbnails !== undefined) {
      payload.thumbnail_images = completeThumbnails;
      payload.thumbnail_image = completeThumbnails[0] || null;
    } else if (finalThumbnails !== undefined) {
      payload.thumbnail_images = finalThumbnails;
      payload.thumbnail_image = finalThumbnails[0] || null;
    }

    if (completeGallery !== undefined) {
      payload.gallery_images = completeGallery;
    } else if (finalGallery !== undefined) {
      payload.gallery_images = finalGallery;
    }

    if (catalogPdf !== undefined) payload.catalog_pdf = catalogPdf;

    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: "Product updated", product: data });
  } catch (err: any) {
    console.error("updateProduct error:", err);
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