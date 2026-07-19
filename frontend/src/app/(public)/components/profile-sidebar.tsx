"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, FileText, MapPin, Bell, LogOut, ChevronRight } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAuthStore } from "@/store/auth.store"
import { apiFetch } from "@/app/lib/api"
import { UserMeResponse } from "../types/user"

export function ProfileSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [name, setName] = useState("—")
  const [image, setImage] = useState<string | null>(null)
  const [orderCount, setOrderCount] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  const loadUser = async () => {
    try {
      const cached = localStorage.getItem("profile-cache")
      if (cached) {
        const d = JSON.parse(cached)
        setName(`${d.first_name ?? ""} ${d.last_name ?? ""}`.trim())
        setImage(typeof d.profile_photo === "string" && d.profile_photo.length > 0 ? d.profile_photo : null)
      }
      const data = await apiFetch<UserMeResponse>("/user/me")
      setName(`${data.first_name ?? ""} ${data.last_name ?? ""}`.trim())
      setImage(typeof data.profile_photo === "string" && data.profile_photo.length > 0 ? data.profile_photo : null)
    } catch { }
  }

  const loadOrderStats = async () => {
    try {
      const data = await apiFetch<any>("/users/me/orders")
      if (data?.summary) setOrderCount(data.summary.total || 0)
      if (data?.orders) {
        const spent = data.orders
          .filter((o: any) => o.status === "completed")
          .reduce((sum: number, o: any) => sum + Number(o.price || 0), 0)
        setTotalSpent(spent)
      }
    } catch { }
  }

  const formatSpent = (v: number) =>
    `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  useEffect(() => { loadUser(); loadOrderStats() }, [])
  useEffect(() => {
    const handler = () => loadUser()
    window.addEventListener("profile-updated", handler)
    return () => window.removeEventListener("profile-updated", handler)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.replace("/")
  }

  const menuItems = [
    { href: "/profile",               label: "Profile Information", icon: User,    badge: null },
    { href: "/profile/orders",        label: "Order History",       icon: FileText, badge: orderCount > 0 ? String(orderCount) : null },
    { href: "/profile/addresses",     label: "Saved Addresses",     icon: MapPin,   badge: null },
    { href: "/profile/notifications", label: "Notifications",       icon: Bell,     badge: null },
  ]

  const initials = name && name !== "—"
    ? name.trim().split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?"

  return (
    <div className="space-y-3">

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gray-100 bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
            {image ? (
              <img key={image} src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-blue-600 font-bold text-lg select-none">{initials}</span>
            )}
          </div>

          {/* Name + link */}
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
            <Link href="/profile" className="text-[11px] text-blue-600 hover:underline font-medium mt-0.5 inline-block">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
            <p className="text-xl font-bold text-gray-900">{orderCount}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Orders</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
            <p className="text-base font-bold text-gray-900 leading-tight truncate">{formatSpent(totalSpent)}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Spent</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 text-sm transition-all border-l-[3px] group",
                i !== 0 && "border-t border-gray-50",
                isActive
                  ? "bg-blue-50 border-blue-600"
                  : "border-transparent hover:bg-gray-50 hover:border-gray-200"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn(
                  "w-[17px] h-[17px] flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className={cn(
                  "font-medium text-[13px]",
                  isActive ? "text-blue-600" : "text-gray-700 group-hover:text-gray-900"
                )}>
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={cn(
                    "text-[11px] font-bold px-2 py-0.5 rounded-full",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={cn(
                  "w-3.5 h-3.5 flex-shrink-0",
                  isActive ? "text-blue-400" : "text-gray-300 group-hover:text-gray-400"
                )} />
              </div>
            </Link>
          )
        })}

        <div className="border-t border-gray-100" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full border-l-[3px] border-transparent hover:bg-red-50 hover:border-red-300 transition-all group"
        >
          <LogOut className="w-[17px] h-[17px] text-red-400 group-hover:text-red-500 flex-shrink-0" />
          <span className="text-[13px] font-medium text-red-500 group-hover:text-red-600">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
