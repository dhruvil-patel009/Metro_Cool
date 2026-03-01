import { Request, Response } from "express";
import { supabase } from "../utils/supabase.js";
import { uploadServiceImage } from "../utils/uploadServiceImage.js";

/* ================= GET SERVICES FOR DROPDOWN ================= */
export const listServices = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("services")
    .select("id, title")
    .order("title");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

/* ================= ADD INCLUDE (MULTIPLE SERVICES) ================= */
export const addServiceInclude = async (req: Request, res: Response) => {
  try {
    const { service_ids, title, description, icon } = req.body;

    if (!service_ids || service_ids.length === 0) {
      return res.status(400).json({ error: "Select at least one service" });
    }

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title required" });
    }

    // create multiple rows
    const rows = service_ids.map((id: string) => ({
      service_id: id,
      title,
      description,
      icon: icon || "SearchCheck",
    }));

    const { error } = await supabase
      .from("service_includes")
      .insert(rows);

    if (error) throw error;

    res.json({ message: "Includes added to multiple services" });
  } catch (err: any) {
    console.error("INCLUDE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= ADD ADDON (MULTIPLE SERVICES + IMAGE) ================= */
export const addServiceAddon = async (req: Request, res: Response) => {
  try {
    const service_ids = JSON.parse(req.body.service_ids);
    const { title, description, price } = req.body;

    if (!service_ids || service_ids.length === 0) {
      return res.status(400).json({ error: "Select at least one service" });
    }

    if (!title?.trim()) {
      return res.status(400).json({ error: "Addon title required" });
    }

    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ error: "Valid price required" });
    }

    let imageUrl: string | null = null;

    if (req.file) {
      imageUrl = await uploadServiceImage(req.file);
    }

    // bulk rows
    const rows = service_ids.map((id: string) => ({
      service_id: id,
      title,
      description,
      price: Number(price),
      image: imageUrl, // IMPORTANT: use image_url column
    }));

    const { error } = await supabase
      .from("service_addons")
      .insert(rows);

    if (error) throw error;

    res.json({ message: "Addon added to multiple services" });
  } catch (err: any) {
    console.error("ADDON ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= ADD FAQ (MULTIPLE SERVICES) ================= */
export const addServiceFaq = async (req: Request, res: Response) => {
  try {
    const { service_ids, question, answer } = req.body;

    if (!service_ids || service_ids.length === 0) {
      return res.status(400).json({ error: "Select at least one service" });
    }

    if (!question?.trim()) {
      return res.status(400).json({ error: "Question required" });
    }

    if (!answer?.trim()) {
      return res.status(400).json({ error: "Answer required" });
    }

    const rows = service_ids.map((id: string) => ({
      service_id: id,
      question,
      answer,
    }));

    const { error } = await supabase
      .from("service_faqs")
      .insert(rows);

    if (error) throw error;

    res.json({ message: "FAQ added to multiple services" });
  } catch (err: any) {
    console.error("FAQ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};