import { supabase } from "./supabase-client";

export const uploadServiceImage = async (file: File) => {
  const ext = file.name.split(".").pop();
  const fileName = `service-images/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("services") // ✅ bucket name
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage
    .from("services")
    .getPublicUrl(fileName);

  return data.publicUrl;
};
