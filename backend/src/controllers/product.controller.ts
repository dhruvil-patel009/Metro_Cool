import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";

/* ---------------- CREATE PRODUCT ---------------- */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      specifications,
      price,
      discountPrice,
      rating,
      inStock,
    } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title & price required" });
    }

    const files = req.files as any;

    const mainImage = files?.mainImage?.[0]?.originalname;
    const thumbnail = files?.thumbnail?.[0]?.originalname;
    const catalogPdf = files?.catalog?.[0]?.originalname;

    const galleryImages =
      files?.gallery?.map((f: any) => f.originalname) || [];

    const { data, error } = await supabase
      .from("products")
      .insert({
        title,
        description,
        specifications: specifications ? JSON.parse(specifications) : null,
        price,
        discount_price: discountPrice,
        rating,
        in_stock: inStock === "true",

        main_image: mainImage,
        thumbnail_image: thumbnail,
        gallery_images: galleryImages,
        catalog_pdf: catalogPdf,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Product created",
      product: data,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------- GET ALL (PUBLIC) ---------------- */
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

  const { data, error } = await supabase
    .from("products")
    .update({
      ...req.body,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    message: "Product updated",
    product: data,
  });
};

/* ---------------- DELETE ---------------- */
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Product deleted" });
};
