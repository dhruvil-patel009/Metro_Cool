export interface Service {
  id: string;
  title: string;
  service_code: string;
  category: string;
  price: number;
  pricing_type: "fixed" | "hourly";
  description?: string;
  image_url?: string;
  is_active: boolean;
}
