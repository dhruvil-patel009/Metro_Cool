"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/store/auth.store";

export default function ProtectedRoute({
  children,
  allow,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { token, user, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // ⏳ Wait until Zustand hydrates from localStorage
    if (!hydrated) return;

    // ❌ Not logged in
    if (!token || !user) {
      router.replace("/auth/login");
      return;
    }

    // ❌ Role not allowed
    if (!allow.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [token, user, allow, hydrated, router]);

  // 🛑 Prevent flash before hydrate
  if (!hydrated || !token || !user) return null;

  return <>{children}</>;
}
