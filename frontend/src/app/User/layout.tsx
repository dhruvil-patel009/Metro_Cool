"use client";

import { Footer } from "./components/footer";
import { Navigation } from "./components/navigation";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navigation />
            <main className="overflow-y-auto bg-gray-50">
                {children}
            </main>
            <Footer />
        </>

    );
}
