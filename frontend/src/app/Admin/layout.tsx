"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import { Header } from "./components/headers";
import { Sidebar } from "./components/Sidebar";

export default function adminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<ProtectedRoute allow={["admin"]}>
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="flex h-full">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex flex-1 flex-col">
          {/* HEADER */}
          <Header />

          {/* CONTENT */}
            {children}
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}
