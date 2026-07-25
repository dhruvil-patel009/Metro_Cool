"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, hydrated } = useAuthStore();
  const router = useRouter();
  // Extra local flag: also check localStorage directly so we don't flash-redirect
  // before Zustand persist rehydration completes.
  const [localChecked, setLocalChecked] = useState(false);
  const [hasLocalToken, setHasLocalToken] = useState(false);

  useEffect(() => {
    // Read directly from localStorage as a second source of truth.
    // This handles the race where hydrated=true but Zustand token is still null
    // because the persist middleware fired but the component rendered before it.
    const direct = localStorage.getItem("accessToken");
    const raw = localStorage.getItem("auth-storage");
    let storeToken: string | null = null;
    try {
      if (raw) storeToken = JSON.parse(raw)?.state?.token ?? null;
    } catch (_) {}

    const found = !!(direct && direct !== "null" && direct !== "undefined") ||
                  !!(storeToken && storeToken !== "null" && storeToken !== "undefined");

    setHasLocalToken(found);
    setLocalChecked(true);
  }, []);

  useEffect(() => {
    if (!localChecked) return;      // wait for localStorage check
    if (!hydrated) return;          // wait for Zustand rehydration

    const isLoggedIn = !!token || hasLocalToken;
    if (!isLoggedIn) {
      router.replace("/");
    }
  }, [token, hydrated, localChecked, hasLocalToken, router]);

  // Show nothing until both checks complete — prevents flash redirect
  if (!localChecked || !hydrated) return null;

  const isLoggedIn = !!token || hasLocalToken;
  if (!isLoggedIn) return null;

  return <>{children}</>;
}