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
  commissionType?: "percentage" | "flat";
  commissionValue?: number;
}
export interface Service {
  id: string
  title: string
  category: string
  price: number
  original_price?: number
  originalPrice?: number
  badge?: string
}

export const getServiceById = async (
  id: string
): Promise<Service> => {
  return apiFetch(`/services/${id}`);
};
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
    image_url: payload.imageUrl,
    is_active: payload.isActive,
    commission_type: payload.commissionType,
    commission_value: payload.commissionValue,
  };

  return apiFetch(`/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendPayload),
  });
};


/* ================= Service Content Types ================= */
export interface ServiceInclude {
  id: string;
  service_id: string;
  title: string;
  description: string;
  icon: string;
  created_at?: string;
}

export interface ServiceAddon {
  id: string;
  service_id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  created_at?: string;
}

export interface ServiceFaq {
  id: string;
  service_id: string;
  question: string;
  answer: string;
  created_at?: string;
}

export interface ServiceContent {
  includes: ServiceInclude[];
  addons: ServiceAddon[];
  faqs: ServiceFaq[];
}

/**
 * ADMIN — Get Service Content (includes, addons, FAQs) for a specific service
 */
export const getServiceContent = async (serviceId: string): Promise<ServiceContent> => {
  return apiFetch(`/service-content/${serviceId}`);
};

/**
 * ADMIN — Get ALL available service content (unique items across all services)
 */
export const getAllServiceContent = async (): Promise<ServiceContent> => {
  return apiFetch(`/service-content/all`);
};

/**
 * ADMIN — Assign selected content to a service (replaces existing)
 */
export const assignContentToService = async (
  serviceId: string,
  content: {
    includes: Pick<ServiceInclude, "title" | "description" | "icon">[];
    addons: Pick<ServiceAddon, "title" | "description" | "price" | "image">[];
    faqs: Pick<ServiceFaq, "question" | "answer">[];
  }
): Promise<{ message: string }> => {
  return apiFetch(`/service-content/${serviceId}/assign`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
};
