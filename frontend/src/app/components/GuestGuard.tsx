"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { token, user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    // already logged in
    if (token) {

      // ⭐ role based redirect
      if (user?.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (user?.role === "technician") {
        router.replace("/technician");
        return;
      }

      // normal user
      router.replace("/");
    }
  }, [token, hydrated, user, router]);

  if (!hydrated) return null;
  if (token) return null;

  return <>{children}</>;
}