"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Settings,
  LifeBuoy,
  CheckCircle2,
  Briefcase,
  Menu,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useSidebar } from "./sidebar-content";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";

/* -------------------- NAV CONFIG -------------------- */

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/technician" },
  { label: "Schedule", icon: Calendar, href: "/technician/schedule" },
  { label: "Jobs", icon: Briefcase, href: "/technician/jobs" },
  { label: "Earnings", icon: DollarSign, href: "/technician/earnings" },
];

const systemItems = [
  { label: "Settings", icon: Settings, href: "/technician/profile" },
  { label: "Support", icon: LifeBuoy, href: "/technician/support" },
];

/* -------------------- COMPONENT -------------------- */

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  /* ---------- ACTIVE ROUTE LOGIC ---------- */
  const isRouteActive = (href: string) => {
    if (href === "/technician") {
      return pathname === "/technician";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  /* ---------- LOGOUT HANDLER ---------- */
  const handleLogout = () => {
    logout(); // ✅ clears token, role, refreshToken, Zustand state

    toast.success("Logged out successfully");

    router.replace("/"); // ✅ correct redirect
  };

  return (
    <>
    {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-3 top-3 z-50 rounded-lg bg-white p-2 shadow md:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen flex flex-col bg-white border-r transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* LOGO / HEADER */}
        <div
          className={cn(
            "flex items-center justify-between p-6",
            isCollapsed && "px-4"
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl whitespace-nowrap">
                TechPortal
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hidden md:flex"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 mt-4 space-y-8 overflow-y-auto">
          {/* OVERVIEW */}
          <div>
            {!isCollapsed && (
              <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overview
              </p>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = isRouteActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-slate-100",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SYSTEM */}
          <div>
            {!isCollapsed && (
              <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                System
              </p>
            )}

            <nav className="space-y-1">
              {systemItems.map((item) => {
                const isActive = isRouteActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-slate-100",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
