"use client"

import { Search, Bell, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { useAuthStore } from "@/store/auth.store";


export function Header() {

  const user = useAuthStore((s) => s.user);
  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Guest";

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "G";

  const profileImage = user?.profile_photo || "";

  return (
    <header className="h-16 border-b bg-white flex items-center lg:justify-between justify-start pl-10 pr-2 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="mx-2 text-lg text-black lg:text-lg font-medium">Dashboard</span>
        <ChevronRight className="w-4 h-4 hidden md:block" />
        <span className="font-medium hidden md:block text-foreground">Overview</span>
      </div>

      <div className="flex items-center sm:gap-6">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10 bg-slate-50 border-none h-10 ring-offset-0 focus-visible:ring-1 focus-visible:ring-slate-200"
            placeholder="Search jobs, customers..."
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="flex items-center gap-3 sm:pl-4">
          <div className="text-right hidden lg:block">
            <div className="text-sm font-semibold text-gray-900">
              {fullName}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {user?.role ?? "Visitor"}
            </div>
          </div>
          <Avatar className="h-9 w-9 border-2 border-slate-100">
            {profileImage ? (
              <AvatarImage
                src={profileImage}
                alt={fullName}
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  )
}
