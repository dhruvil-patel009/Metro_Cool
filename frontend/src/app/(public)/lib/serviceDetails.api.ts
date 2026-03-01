const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const getFullServiceDetails = async (id: string) => {
  const res = await fetch(`${API}/service-details/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load service");

  return res.json();
};