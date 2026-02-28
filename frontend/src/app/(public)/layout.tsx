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
    pathname?.includes("/services/") &&
    pathname?.endsWith("/booking/success");

    return (
        <>
             {!hideLayout && <Navigation />}
        {children}
      {!hideLayout && <Footer />}
    </>

    );
}
