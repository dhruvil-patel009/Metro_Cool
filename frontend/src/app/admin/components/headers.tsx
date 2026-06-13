"use client"

import { Search, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { NotificationsDropdown } from "../components/notification-dropdown"
import { useAuthStore } from "@/store/auth.store"

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/admin":             { title: "Dashboard",    sub: "Overview of your operations" },
  "/admin/Services":    { title: "Services",     sub: "Manage your service offerings" },
  "/admin/products":    { title: "Products",     sub: "Manage products and inventory" },
  "/admin/Technician":  { title: "Technicians",  sub: "Manage your field technicians" },
  "/admin/users":       { title: "Users",        sub: "Registered customer accounts" },
  "/admin/Bookings":    { title: "Bookings",     sub: "Track and manage appointments" },
  "/admin/Settlements": { title: "Settlements",  sub: "Payouts and commission reports" },
  "/admin/Settings":    { title: "Settings",     sub: "Account and system preferences" },
  "/admin/Categories":  { title: "Categories",   sub: "Service category management" },
  "/admin/Services/content": { title: "Service Content", sub: "Includes, add-ons & FAQs" },
}

export function Header() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)

  const pageInfo =
    pageTitles[pathname] ||
    pageTitles["/" + pathname.split("/").slice(1, 3).join("/")] ||
    { title: "Admin", sub: "" }

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()
  const profileImage = user?.profile_photo || ""

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center bg-white/90 backdrop-blur-md border-b border-gray-100/80 px-4 lg:px-6 gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

      {/* Page title */}
      <div className="hidden md:flex flex-col flex-shrink-0 min-w-0">
        <h1 className="text-[15px] font-bold text-gray-900 leading-none truncate">{pageInfo.title}</h1>
        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{pageInfo.sub}</p>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-7 bg-gray-200 mx-1" />

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything…"
            className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50/80 pl-8.5 pr-4 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">

        {/* Notifications */}
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <NotificationsDropdown />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

        {/* Profile chip */}
        <div className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <Avatar className="h-8 w-8 ring-2 ring-offset-1 ring-gray-200 group-hover:ring-blue-300 transition-all">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={fullName} referrerPolicy="no-referrer" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                {initials || "A"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-semibold text-gray-800 leading-none">
              {fullName || "Admin"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">{greeting}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
