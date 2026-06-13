"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Briefcase, Users, UserCircle,
  Calendar, CreditCard, Settings, LogOut, Menu,
  PackageSearch, ChevronLeft, ChevronRight, Layers, Zap,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { toast } from "react-toastify"
import { useAuthStore } from "@/store/auth.store"

const menuGroups = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard",   href: "/admin",              accent: "#3b82f6" },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: Briefcase,       label: "Services",     href: "/admin/Services",     accent: "#8b5cf6" },
      { icon: Layers,          label: "Categories",   href: "/admin/Categories",   accent: "#6366f1" },
      { icon: PackageSearch,   label: "Products",     href: "/admin/products",     accent: "#06b6d4" },
      { icon: Users,           label: "Technicians",  href: "/admin/Technician",   accent: "#10b981" },
      { icon: UserCircle,      label: "Users",        href: "/admin/users",        accent: "#f97316" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Calendar,        label: "Bookings",     href: "/admin/Bookings",     accent: "#f43f5e" },
      { icon: CreditCard,      label: "Settlements",  href: "/admin/Settlements",  accent: "#f59e0b" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings,        label: "Settings",     href: "/admin/Settings",     accent: "#94a3b8" },
    ],
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.replace("/")
  }

  const SidebarContent = () => (
    <aside className={cn(
      "fixed lg:static inset-y-0 left-0 z-40 flex h-screen flex-col",
      "bg-[#0f172a] border-r border-white/[0.06]",
      "transition-all duration-300 ease-in-out",
      isOpen ? "w-[220px]" : "w-[68px]",
      isMobileOpen ? "translate-x-0" : "-translate-x-full",
      "lg:translate-x-0"
    )}>

      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center flex-shrink-0 border-b border-white/[0.06]",
        isOpen ? "px-4 justify-between" : "justify-center"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <p className="font-bold text-white text-sm leading-none truncate">Metro Cool</p>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">Admin Panel</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {isOpen && (
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={!isOpen ? item.label : undefined}
                    className={cn(
                      "group flex items-center rounded-lg transition-all duration-150",
                      isOpen ? "gap-2.5 px-2 py-2" : "justify-center w-10 h-10 mx-auto",
                      isActive
                        ? "bg-white/10"
                        : "hover:bg-white/[0.05]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-md flex-shrink-0 transition-all",
                        isOpen ? "w-7 h-7" : "w-8 h-8",
                      )}
                      style={{
                        background: isActive
                          ? `${item.accent}25`
                          : "transparent",
                      }}
                    >
                      <item.icon
                        className="h-[15px] w-[15px] transition-colors"
                        style={{ color: isActive ? item.accent : "#64748b" }}
                      />
                    </div>
                    {isOpen && (
                      <span
                        className={cn(
                          "text-[13px] font-medium truncate transition-colors flex-1",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                    {isOpen && isActive && (
                      <div
                        className="w-1 h-4 rounded-full flex-shrink-0"
                        style={{ background: item.accent }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse button (collapsed state) */}
      {!isOpen && (
        <div className="px-2 py-2 border-t border-white/[0.06]">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg hover:bg-white/10 transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      )}

      {/* Logout */}
      <div className={cn(
        "border-t border-white/[0.06] flex-shrink-0",
        isOpen ? "p-3" : "p-2"
      )}>
        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : undefined}
          className={cn(
            "group flex items-center w-full rounded-lg transition-all duration-150",
            isOpen ? "gap-2.5 px-2 py-2 hover:bg-red-500/10" : "justify-center w-10 h-10 mx-auto hover:bg-red-500/10"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-md flex-shrink-0",
            isOpen ? "w-7 h-7" : "w-8 h-8",
          )}>
            <LogOut className="h-[15px] w-[15px] text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
          {isOpen && (
            <span className="text-[13px] font-medium text-slate-400 group-hover:text-red-400 transition-colors">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile toggle */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-3 top-3 z-50 flex items-center justify-center w-9 h-9 rounded-xl bg-[#0f172a] shadow-lg border border-white/10 lg:hidden"
        >
          <Menu className="h-4 w-4 text-white" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SidebarContent />
    </>
  )
}
