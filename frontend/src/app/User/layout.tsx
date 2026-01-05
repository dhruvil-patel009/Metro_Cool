"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./components/footer";
import { Navigation } from "./components/navigation";


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
      <main className="min-h-screen overflow-y-auto bg-gray-50">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </>

    );
}
