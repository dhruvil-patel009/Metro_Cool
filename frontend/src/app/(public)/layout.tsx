"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./components/footer";
import { Navigation } from "./components/navigation";
import { usePushSubscription } from "@/hooks/usePushSubscription";


export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
      const pathname = usePathname();
const hideLayout =
    pathname?.includes("/services/") &&
    pathname?.endsWith("/booking/success");

    // Auto-request notification permission & subscribe when user is logged in
    usePushSubscription();

    return (
        <>
             {!hideLayout && <Navigation />}
        {children}
      {!hideLayout && <Footer />}
    </>

    );
}
