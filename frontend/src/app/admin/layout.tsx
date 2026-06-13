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
    <ProtectedRoute>
      <div className="flex h-screen bg-[#f4f6fb] overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* HEADER */}
          <Header />

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
