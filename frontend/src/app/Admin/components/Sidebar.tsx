"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FolderTree,
  Users,
  UserCircle,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Briefcase, label: "Services", href: "/admin/Services" },
  { icon: FolderTree, label: "Categories", href: "/admin/Categories" },
  { icon: Users, label: "Technicians", href: "/admin/Technician" },
  { icon: UserCircle, label: "Users", href: "/admin/users" },
  { icon: Calendar, label: "Bookings", href: "/admin/Bookings" },
  { icon: CreditCard, label: "Settlements", href: "/admin/Settlements" },
  { icon: Settings, label: "Settings", href: "/admin/Settings" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
    const router = useRouter()
  const logout = useAuthStore((s) => s.logout);
  


    /* ---------- LOGOUT HANDLER ---------- */
  // const handleLogout = async () => {
  //   try {
  //     await fetch("http://localhost:5000/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include", // 🔑 important
  //     })

  //     router.push("/")
  //   } catch (error) {
  //     console.error("Logout failed", error)
  //   }
  // }

  const handleLogout = () => {
    logout(); // ✅ clears token, role, refreshToken, Zustand state

    toast.success("Logged out successfully");

    
    router.replace("/"); // ✅ correct redirect
  };

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
<aside
  className={cn(
    "fixed lg:static inset-y-0 left-0 z-40 flex h-screen flex-col bg-white shadow-sm transition-all duration-300",
    isOpen ? "w-64" : "w-20",
    isMobileOpen ? "translate-x-0" : "-translate-x-full",
    "lg:translate-x-0"
  )}
>

        {/* HEADER */}
        <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-cyan-500">
              <div className="h-5 w-5 rounded border-2 border-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-sm font-bold">Comfort AC</h1>
                <p className="text-xs text-gray-500">admin Panel</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:block rounded p-1 hover:bg-gray-100"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* MENU (SCROLLABLE) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive =
  item.href === "/admin"
    ? pathname === "/admin"
    : pathname === item.href || pathname.startsWith(item.href + "/");


            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-cyan-50 text-cyan-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT (ALWAYS AT BOTTOM) */}
        <div className="border-t p-3 shrink-0">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"           onClick={handleLogout}
>
            <LogOut className="h-5 w-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
