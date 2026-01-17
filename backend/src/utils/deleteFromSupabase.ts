import { supabase } from "./supabase.js";

export const deleteFileFromSupabase = async (publicUrl?: string) => {
  if (!publicUrl) return;

  // Extract path after bucket
  const path = publicUrl.split("/products/")[1];
  if (!path) return;

  await supabase.storage.from("products").remove([path]);
};
