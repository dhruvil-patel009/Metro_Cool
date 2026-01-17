import { supabase } from "./supabase.js";

export const uploadFileToSupabase = async (
  file: Express.Multer.File,
  folder: string
) => {
  const filePath = `${folder}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
