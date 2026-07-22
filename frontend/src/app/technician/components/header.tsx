"use client"

import { Search, ChevronRight, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Input } from "@/app/components/ui/input"
import { useAuthStore } from "@/store/auth.store"
import { usePathname } from "next/navigation"
import { NotificationDropdown } from "./notification-dropdown"

/* Route → label mapping */
const routeLabels: Record<string, string> = {
  "/technician":               "Dashboard",
  "/technician/schedule":      "Schedule",
  "/technician/jobs":          "Jobs",
  "/technician/notifications": "Notifications",
  "/technician/service-reports": "Service Reports",
  "/technician/earnings":      "Earnings",
  "/technician/profile":       "Profile",
  "/technician/support":       "Support",
}

export function Header() {
  const user = useAuthStore((s) => s.user)
  const pathname = usePathname()

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest"

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "G"

  const profileImage = user?.profile_photo || ""

  // Determine page title from route
  const pageTitle = Object.entries(routeLabels).find(
    ([route]) => pathname === route
  )?.[1] || (pathname.includes("/technician/jobs/") ? "Job Details" : "Dashboard")

  return (
    <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-sm flex items-center justify-between pl-12 md:pl-6 pr-4 sm:pr-6 sticky top-0 z-10">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium hidden sm:inline">Technician</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
        <span className="font-semibold text-slate-900">{pageTitle}</span>
      </div>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search - desktop only */}
        <div className="relative w-64 hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            className="pl-9 bg-slate-50 border-slate-200 h-9 rounded-lg text-sm focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:border-blue-300"
            placeholder="Search jobs, customers..."
          />
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{fullName}</p>
            <p className="text-[11px] text-slate-400 capitalize">{user?.role ?? "Technician"}</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-slate-100 shadow-sm">
            {profileImage ? (
              <AvatarImage
                src={profileImage}
                alt={fullName}
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  )
}
