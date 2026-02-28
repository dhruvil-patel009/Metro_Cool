"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Bell,
  Car,
  CheckCircle2,
  Tag,
  Star,
  Lock,
  Check,
  Settings2,
  ExternalLink,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Switch } from "@/app/components/ui/switch"
import { cn } from "@/app/lib/utils"
import { ProfileSidebar } from "../../components/profile-sidebar"

/* =========================
   TYPES
========================= */

interface NotificationItem {
  id: number
  type: string
  icon: LucideIcon
  iconBg: string
  title: string
  description: string
  time: string
  unread: boolean

  // ✅ OPTIONAL (this fixes the TS error)
  actions?: string[]
  rating?: boolean
}

interface NotificationGroup {
  group: string
  items: NotificationItem[]
}

/* =========================
   DATA
========================= */

const notifications: NotificationGroup[] = [
  {
    group: "TODAY",
    items: [
      {
        id: 1,
        type: "service",
        icon: Car,
        iconBg: "bg-blue-600 text-white",
        title: "Technician En Route",
        description:
          "Mike R. is on the way for your Full Home Deep Clean. Estimated arrival in 15 mins.",
        time: "Just now",
        unread: true,
        actions: ["Track Live", "View Order"],
      },
      {
        id: 2,
        type: "order",
        icon: CheckCircle2,
        iconBg: "bg-green-100 text-green-600",
        title: "Order Confirmed",
        description:
          "Your booking for AC Repair & Service (#ORD-2839) has been confirmed successfully.",
        time: "2 hours ago",
        unread: true,
      },
      {
        id: 3,
        type: "promo",
        icon: Tag,
        iconBg: "bg-orange-100 text-orange-600",
        title: "Flash Sale: 20% Off!",
        description:
          "Limited time offer on all smart thermostats. Upgrade your home cooling today.",
        time: "5 hours ago",
        unread: false,
        actions: ["Shop Deals"],
      },
    ],
  },
  {
    group: "YESTERDAY",
    items: [
      {
        id: 4,
        type: "feedback",
        icon: Star,
        iconBg: "bg-gray-100 text-gray-400",
        title: "Rate your experience",
        description:
          "How was your recent plumbing checkup with David? Your feedback helps us improve.",
        time: "Yesterday, 4:00 PM",
        unread: false,
        rating: true,
      },
      {
        id: 5,
        type: "account",
        icon: Lock,
        iconBg: "bg-purple-100 text-purple-600",
        title: "Password Updated",
        description:
          "Your account password was successfully changed. If this wasn't you, please contact support.",
        time: "Yesterday, 9:30 AM",
        unread: false,
      },
    ],
  },
]

const filters = [
  { label: "All Alerts", count: null },
  { label: "Unread", count: 3 },
  { label: "Orders", count: null },
  { label: "Promotions", count: null },
]

/* =========================
   PAGE
========================= */

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All Alerts")

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/profile">My Account</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Notifications</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Notifications */}
          <div className="lg:col-span-6">
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-gray-500 mt-1">
                  Stay updated with your orders and offers.
                </p>
              </div>
              <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600">
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setActiveFilter(f.label)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-sm font-semibold",
                    activeFilter === f.label
                      ? "bg-gray-900 text-white"
                      : "bg-white border text-gray-500",
                  )}
                >
                  {f.label}
                  {f.count && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded-md">
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="space-y-10">
              {notifications.map((group) => (
                <div key={group.group}>
                  <h2 className="text-xs font-bold text-gray-400 mb-4">
                    {group.group}
                  </h2>

                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "bg-white p-6 rounded-3xl border relative",
                          item.unread && "ring-1 ring-blue-100",
                        )}
                      >
                        <div className="flex gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center",
                              item.iconBg,
                            )}
                          >
                            <item.icon className="w-6 h-6" />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-bold">{item.title}</h3>
                              <span className="text-xs text-gray-400">
                                {item.time}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">
                              {item.description}
                            </p>

                            {/* ✅ ACTIONS */}
                            {item.actions && (
                              <div className="flex gap-3">
                                {item.actions.map((action) => (
                                  <button
                                    key={action}
                                    className="px-4 py-1.5 text-xs font-bold border rounded-lg"
                                  >
                                    {action}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* ✅ RATING */}
                            {item.rating && (
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className="w-5 h-5 text-gray-300 hover:text-yellow-400 cursor-pointer"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-3xl border sticky top-8">
              <h2 className="font-bold mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Preferences
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Email Alerts</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between">
                  <span>SMS Alerts</span>
                  <Switch defaultChecked />
                </div>
              </div>

              <button className="mt-6 text-sm text-blue-600 flex items-center gap-1">
                Advanced Settings
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
