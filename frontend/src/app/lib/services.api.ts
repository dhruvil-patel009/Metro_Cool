import { apiFetch } from "@/app/lib/api";

export interface CreateServicePayload {
  title: string;
  serviceCode: string;
  category: string;
  price: number;
  pricingType: "fixed" | "hourly";
  description?: string;
  shortdescription?: string;
  rating?: number;
  badge?: string;
  badgeColor?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * ADMIN — Create Service
 */
export const createService = async (payload: CreateServicePayload) => {
  return apiFetch("/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

/**
 * ADMIN — Get All Services
 */
export const getAllServicesAdmin = async () => {
  return apiFetch("/services/admin");
};

/**
 * ADMIN — Toggle Service Status
 */
export const toggleServiceStatus = async (
  id: string,
  isActive: boolean
) => {
  return apiFetch(`/services/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
};

/**
 * ADMIN — Delete Service
 */
export const deleteService = async (id: string) => {
  return apiFetch(`/services/${id}`, {
    method: "DELETE",
  });
};


export const updateService = async (
  id: string,
  payload: Partial<CreateServicePayload>
) => {
  const backendPayload = {
    title: payload.title,
    category: payload.category,
    price: payload.price,
    pricing_type: payload.pricingType,
    description: payload.description,
     short_description: payload.shortdescription,

    rating: payload.rating,
    badge: payload.badge,
    badge_color: payload.badgeColor,
    image_url: payload.imageUrl,   // ✅ FIX
    is_active: payload.isActive,   // ✅ FIX
  };

  return apiFetch(`/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendPayload),
  });
};

