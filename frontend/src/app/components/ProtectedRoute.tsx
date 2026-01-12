"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/store/auth.store";

export default function ProtectedRoute({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow: Role[];
}) {
  const { token, role, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!token || !role) {
      router.replace("/auth/login");
      return;
    }

    if (!allow.includes(role)) {
      router.replace("/403");
    }
  }, [hydrated, token, role]);

  if (!hydrated) return null;

  return <>{children}</>;
}
