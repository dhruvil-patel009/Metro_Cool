"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/Admin" },
  { icon: Briefcase, label: "Services", href: "/Admin/Services" },
  { icon: FolderTree, label: "Categories", href: "/Admin/Categories" },
  { icon: Users, label: "Technicians", href: "/Admin/Technician" },
  { icon: UserCircle, label: "Users", href: "/Admin/users" },
  { icon: Calendar, label: "Bookings", href: "/Admin/Bookings" },
  { icon: CreditCard, label: "Settlements", href: "/Admin/Settlements" },
  { icon: Settings, label: "Settings", href: "/Admin/Settings" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

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
                <h1 className="text-sm font-bold">Comfort HVAC</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
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
  item.href === "/Admin"
    ? pathname === "/Admin"
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
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
