import { useAuthStore } from "@/store/auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "API Error");
  }

  return res.json();
}
