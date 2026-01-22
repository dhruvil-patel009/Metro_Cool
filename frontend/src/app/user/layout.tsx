"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./components/footer";
import { Navigation } from "./components/navigation";
import ProtectedRoute from "../components/ProtectedRoute";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
      const pathname = usePathname();
const hideLayout =
    pathname?.includes("/User/services/") &&
    pathname?.endsWith("/booking/success");

    return (
        <>
             {!hideLayout && <Navigation />}
      <ProtectedRoute allow={["user"]}>
        {children}
      </ProtectedRoute>
      {!hideLayout && <Footer />}
    </>

    );
}
