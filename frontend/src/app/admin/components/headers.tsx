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

  // Today's greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="flex h-16 items-center gap-4 pl-14 pr-4 sm:pl-6 lg:pl-6 lg:pr-6">

        {/* Page title — hidden on small screens, visible md+ */}
        <div className="hidden md:block flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900 leading-none">{pageInfo.title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{pageInfo.sub}</p>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto md:mx-0 md:ml-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything…"
              className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">

          {/* Notifications */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors">
            <NotificationsDropdown />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          {/* Profile */}
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {fullName || "Admin"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 capitalize">
                {greeting}
              </p>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
              {profileImage ? (
                <AvatarImage src={profileImage} alt={fullName} referrerPolicy="no-referrer" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                  {initials || "A"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
