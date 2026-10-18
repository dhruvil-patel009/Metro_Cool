import { apiFetch } from "@/app/lib/api";

/* ================= TYPES ================= */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
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

export const createProduct = async (data: FormData | Record<string, any>) => {
  const token = localStorage.getItem("accessToken");
  const isFormData = data instanceof FormData;

  const res = await fetch(`${API_URL}/products/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to create product (${res.status} ${res.statusText})`);
  }

  return res.json();
};

/* ================= UPDATE ================= */

export const updateProduct = async (
  id: string,
  data: FormData | Record<string, any>
) => {
  const token = localStorage.getItem("accessToken");
  const isFormData = data instanceof FormData;

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to update product (${res.status} ${res.statusText})`);
  }

  return res.json();
};

/* ================= DELETE ================= */

export const deleteProduct = async (id: string) => {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
};
