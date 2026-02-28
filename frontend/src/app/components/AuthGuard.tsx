"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    // not logged in
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, hydrated, router]);

  // wait for zustand
  if (!hydrated) return null;

  // block rendering while redirecting
  if (!token) return null;

  return <>{children}</>;
}