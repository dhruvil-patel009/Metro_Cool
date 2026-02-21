// src/lib/api.ts

import { useAuthStore } from "@/store/auth.store";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * Universal API Fetch (ALWAYS sends JWT automatically)
 */
export async function apiFetch<T>(url: string, options: RequestInit = {}) {

  // 🔥 DO NOT read from zustand here
  // Always read from localStorage (NextJS timing issue)
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") && localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    // auto logout if token invalid
    if (res.status === 401) {
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    throw new Error(err.error || "API Error");
  }

  return res.json();
}