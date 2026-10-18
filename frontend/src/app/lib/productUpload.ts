import { supabase } from "./supabase-client";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (Supabase Storage max)

/**
 * Upload a product image or PDF directly to Supabase storage.
 * - Uses signed upload URL from backend to bypass Vercel 4.5MB serverless payload limit
 * - Bypasses Supabase RLS restrictions safely
 * - Fallbacks to direct Supabase client upload if signed URL route is not yet deployed
 * - Tracks upload percentage progress for large files (e.g. 20MB+ PDFs)
 */
export async function uploadProductAsset(
  file: File,
  folder: "main" | "thumbnail" | "gallery" | "catalog",
  onProgress?: (percent: number) => void
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File "${file.name}" is ${sizeMb}MB, which exceeds the 50MB limit.`);
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.metro-cool.com/api";

  // Strategy 1: Signed Upload URL via backend (Preferred - bypasses Vercel 4.5MB limit & RLS)
  if (token) {
    try {
      const res = await fetch(`${apiUrl}/products/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          folder,
        }),
      });

      if (res.ok) {
        const { signedUrl, publicUrl } = await res.json();

        // Direct PUT streaming directly to Supabase Storage
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

          if (xhr.upload && onProgress) {
            xhr.upload.onprogress = (evt) => {
              if (evt.lengthComputable) {
                const pct = Math.round((evt.loaded / evt.total) * 100);
                onProgress(pct);
              }
            };
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              if (onProgress) onProgress(100);
              resolve();
            } else {
              reject(new Error(`Storage returned HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during file upload to storage"));
          xhr.ontimeout = () => reject(new Error("File upload timed out"));

          xhr.send(file);
        });

        return publicUrl;
      }
    } catch (err: any) {
      console.warn("Signed URL upload attempt failed, trying fallback:", err?.message || err);
    }
  }

  // Strategy 2: Direct upload using Supabase client (fallback if RLS policy applied)
  try {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
    const cleanBase = file.name
      .substring(0, file.name.lastIndexOf(".") !== -1 ? file.name.lastIndexOf(".") : file.name.length)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = `${folder}/${Date.now()}-${cleanBase}${ext ? `.${ext}` : ""}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: pubData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    if (onProgress) onProgress(100);
    return pubData.publicUrl;
  } catch (err: any) {
    console.error("Direct Supabase upload error:", err);
    throw new Error(
      err?.message ||
      "Failed to upload file. Please ensure file permissions are set on Supabase or try again."
    );
  }
}
