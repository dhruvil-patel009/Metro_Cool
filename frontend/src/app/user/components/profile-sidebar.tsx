"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, FileText, MapPin, CreditCard, Bell, LogOut } from "lucide-react"
import { cn } from "@/app/lib/utils"

export function ProfileSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/user/profile", label: "Profile Information", icon: User, badge: null },
    { href: "/user/profile/orders", label: "Order History", icon: FileText, badge: "24" },
    { href: "/user/profile/addresses", label: "Saved Addresses", icon: MapPin, badge: null },
    { href: "/user/profile/notifications", label: "Notifications", icon: Bell, badge: null },
  ]

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Alex Johnson</h3>
        <p className="text-sm text-gray-500 mb-4">alex.johnson@example.com</p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Orders</div>
            <div className="text-2xl font-bold text-gray-900">24</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Saved</div>
            <div className="text-2xl font-bold text-gray-900">$1.2k</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-all border-l-4",
                isActive
                  ? "bg-blue-50 text-blue-600 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200 hover:text-gray-900",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", isActive && "text-blue-600")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={cn("text-xs font-normal", isActive ? "text-blue-600" : "text-gray-500")}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}

        <button className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full border-l-4 border-transparent hover:border-red-200">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Promotional Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-2">Summer Sale!</h3>
        <p className="text-sm text-blue-100 mb-4">Get 20% off on all AC servicing packages this month.</p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
          View Offers
        </button>
      </div>
    </div>
  )
}
