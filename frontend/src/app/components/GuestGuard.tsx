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

  if (!hydrated) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-400 font-medium animate-pulse">Loading…</p>
    </div>
  );
  if (token) return null;

  return <>{children}</>;
}