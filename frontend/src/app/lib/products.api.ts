import { apiFetch } from "@/app/lib/api";

/* ================= TYPES ================= */

export interface Product {
  id: string;
  title: string;
  description?: string;
  specifications?: Record<string, any>;
  price: number;
  discount_price?: number;
  rating?: number;
  in_stock: boolean;

  main_image?: string;
  thumbnail_image?: string;
  gallery_images?: string[];
  catalog_pdf?: string;
}

/* ================= GET ================= */

// GET ALL
export const getProducts = async (): Promise<Product[]> => {
  return apiFetch("/products");
};

// GET ONE
export const getProductById = async (id: string): Promise<Product> => {
  return apiFetch(`/products/${id}`);
};

/* ================= CREATE ================= */

export const createProduct = async (payload: FormData) => {
  return apiFetch("/products", {
    method: "POST",
    body: payload, // ✅ FormData
  });
};


/* ================= UPDATE ================= */

export const updateProduct = async (
  id: string,
  payload: Partial<Product>
) => {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
};

/* ================= DELETE ================= */

export const deleteProduct = async (id: string) => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
};
