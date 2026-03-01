import { supabase } from "./supabase.js";

export const uploadServiceImage = async (file: Express.Multer.File) => {
  const ext = file.originalname.split(".").pop();
  const fileName = `addon-${Date.now()}.${ext}`;
  const filePath = `addons/${fileName}`;

  const { error } = await supabase.storage
    .from("service-assets")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("STORAGE ERROR:", error);
    throw new Error("Image upload failed");
  }

  const { data } = supabase.storage
    .from("service-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
};