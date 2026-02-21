// src/lib/api.ts

import { useAuthStore } from "@/store/auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * Universal API Fetch (ALWAYS sends JWT automatically)
 */
export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {

  // ✅ Read token from Zustand (NOT localStorage)
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  // If token expired → auto logout
  if (res.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/auth/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "API request failed");
  }

  return res.json();
}