"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Briefcase, Users, UserCircle,
  Calendar, CreditCard, Settings, LogOut, Menu, X,
  PackageSearch, ChevronRight,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { toast } from "react-toastify"
import { useAuthStore } from "@/store/auth.store"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/admin",              color: "text-blue-500" },
  { icon: Briefcase,       label: "Services",     href: "/admin/Services",     color: "text-violet-500" },
  { icon: PackageSearch,   label: "Products",     href: "/admin/products",     color: "text-cyan-500" },
  { icon: Users,           label: "Technicians",  href: "/admin/Technician",   color: "text-emerald-500" },
  { icon: UserCircle,      label: "Users",        href: "/admin/users",        color: "text-orange-500" },
  { icon: Calendar,        label: "Bookings",     href: "/admin/Bookings",     color: "text-rose-500" },
  { icon: CreditCard,      label: "Settlements",  href: "/admin/Settlements",  color: "text-amber-500" },
  { icon: Settings,        label: "Settings",     href: "/admin/Settings",     color: "text-slate-500" },
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
      "bg-white border-r border-gray-100 shadow-sm",
      "transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-[72px]",
      isMobileOpen ? "translate-x-0" : "-translate-x-full",
      "lg:translate-x-0"
    )}>

      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b border-gray-100 flex-shrink-0",
        isOpen ? "px-5 justify-between" : "px-0 justify-center"
      )}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
            <span className="text-white font-bold text-sm">MC</span>
          </div>
          {isOpen && (
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-none truncate">Metro Cool</p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">Admin Panel</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          <ChevronRight className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-0.5">
        {isOpen && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 pb-2 pt-1">
            Main Menu
          </p>
        )}
        {menuItems.map((item) => {
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
                "group flex items-center rounded-xl transition-all duration-150",
                isOpen ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5 mx-auto w-11 h-11",
                isActive
                  ? "bg-blue-50 shadow-sm"
                  : "hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-lg flex-shrink-0 transition-all",
                isOpen ? "w-8 h-8" : "w-9 h-9",
                isActive ? "bg-white shadow-sm" : "group-hover:bg-white group-hover:shadow-sm"
              )}>
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  isActive ? item.color : "text-gray-400 group-hover:" + item.color.replace("text-", "text-")
                )} />
              </div>
              {isOpen && (
                <span className={cn(
                  "text-sm font-medium truncate transition-colors",
                  isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                )}>
                  {item.label}
                </span>
              )}
              {isOpen && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : undefined}
          className={cn(
            "group flex items-center w-full rounded-xl transition-all duration-150 hover:bg-red-50",
            isOpen ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5 mx-auto w-11 h-11"
          )}
        >
          <div className={cn(
            "flex items-center justify-center rounded-lg transition-all flex-shrink-0",
            isOpen ? "w-8 h-8" : "w-9 h-9",
            "group-hover:bg-white group-hover:shadow-sm"
          )}>
            <LogOut className="h-[18px] w-[18px] text-gray-400 group-hover:text-red-500 transition-colors" />
          </div>
          {isOpen && (
            <span className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
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
          className="fixed left-3 top-3 z-50 flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-md border border-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <SidebarContent />
    </>
  )
}
