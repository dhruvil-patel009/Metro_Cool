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


/* ================= GET CONTENT FOR A SPECIFIC SERVICE ================= */
export const getServiceContentById = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ error: "Service ID required" });
    }

    const [includesResult, addonsResult, faqsResult] = await Promise.all([
      supabase
        .from("service_includes")
        .select("*")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: true }),
      supabase
        .from("service_addons")
        .select("*")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: true }),
      supabase
        .from("service_faqs")
        .select("*")
        .eq("service_id", serviceId)
        .order("created_at", { ascending: true }),
    ]);

    res.json({
      includes: includesResult.data || [],
      addons: addonsResult.data || [],
      faqs: faqsResult.data || [],
    });
  } catch (err: any) {
    console.error("GET SERVICE CONTENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL CONTENT (FOR ADMIN SELECTION) ================= */
export const getAllServiceContent = async (_req: Request, res: Response) => {
  try {
    const [includesResult, addonsResult, faqsResult] = await Promise.all([
      supabase
        .from("service_includes")
        .select("*")
        .order("title", { ascending: true }),
      supabase
        .from("service_addons")
        .select("*")
        .order("title", { ascending: true }),
      supabase
        .from("service_faqs")
        .select("*")
        .order("question", { ascending: true }),
    ]);

    // Deduplicate by title (includes/addons) or question (faqs) to get unique content items
    const uniqueIncludes = deduplicateBy(includesResult.data || [], "title");
    const uniqueAddons = deduplicateBy(addonsResult.data || [], "title");
    const uniqueFaqs = deduplicateBy(faqsResult.data || [], "question");

    res.json({
      includes: uniqueIncludes,
      addons: uniqueAddons,
      faqs: uniqueFaqs,
    });
  } catch (err: any) {
    console.error("GET ALL CONTENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* Helper: deduplicate array by a key, keeping the first occurrence */
function deduplicateBy(arr: any[], key: string) {
  const seen = new Set<string>();
  return arr.filter((item) => {
    const val = (item[key] || "").trim().toLowerCase();
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

/* ================= ASSIGN CONTENT TO A SERVICE (BULK) ================= */
export const assignContentToService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    const { includes, addons, faqs } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: "Service ID required" });
    }

    // 1. Delete existing content for this service
    await Promise.all([
      supabase.from("service_includes").delete().eq("service_id", serviceId),
      supabase.from("service_addons").delete().eq("service_id", serviceId),
      supabase.from("service_faqs").delete().eq("service_id", serviceId),
    ]);

    // 2. Insert selected content
    const errors: string[] = [];

    if (includes && includes.length > 0) {
      const includeRows = includes.map((item: any) => ({
        service_id: serviceId,
        title: item.title,
        description: item.description || "",
        icon: item.icon || "SearchCheck",
      }));
      const { error } = await supabase.from("service_includes").insert(includeRows);
      if (error) errors.push(`Includes: ${error.message}`);
    }

    if (addons && addons.length > 0) {
      const addonRows = addons.map((item: any) => ({
        service_id: serviceId,
        title: item.title,
        description: item.description || "",
        price: Number(item.price) || 0,
        image: item.image || null,
      }));
      const { error } = await supabase.from("service_addons").insert(addonRows);
      if (error) errors.push(`Addons: ${error.message}`);
    }

    if (faqs && faqs.length > 0) {
      const faqRows = faqs.map((item: any) => ({
        service_id: serviceId,
        question: item.question,
        answer: item.answer,
      }));
      const { error } = await supabase.from("service_faqs").insert(faqRows);
      if (error) errors.push(`FAQs: ${error.message}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join("; ") });
    }

    res.json({ message: "Service content updated successfully" });
  } catch (err: any) {
    console.error("ASSIGN CONTENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
