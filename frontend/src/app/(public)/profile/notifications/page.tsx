"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Bell,
  CheckCircle2,
  Package,
  Wrench,
  ShoppingBag,
  XCircle,
  Clock,
  BellOff,
} from "lucide-react"
import { ProfileSidebar } from "../../components/profile-sidebar"
import { apiFetch } from "@/app/lib/api"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
  link?: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiFetch<{ notifications: Notification[] }>("/user/notifications")
        setNotifications(data.notifications || [])
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "booking": return <Wrench className="w-5 h-5" />
      case "completed": return <CheckCircle2 className="w-5 h-5" />
      case "cancelled": return <XCircle className="w-5 h-5" />
      case "order": return <ShoppingBag className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getIconStyle = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-50 text-blue-600"
      case "completed": return "bg-emerald-50 text-emerald-600"
      case "cancelled": return "bg-red-50 text-red-500"
      case "order": return "bg-violet-50 text-violet-600"
      default: return "bg-gray-100 text-gray-500"
    }
  }

  const formatTime = (time: string) => {
    const now = new Date()
    const date = new Date(time)
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => {
        if (filter === "bookings") return ["booking", "completed", "cancelled"].includes(n.type)
        if (filter === "orders") return n.type === "order"
        return true
      })

  // Group by today / earlier
  const today = new Date().toDateString()
  const todayItems = filtered.filter(n => new Date(n.time).toDateString() === today)
  const earlierItems = filtered.filter(n => new Date(n.time).toDateString() !== today)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/profile" className="hover:text-gray-600 transition-colors">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">Notifications</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1d242d]">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Stay updated with your bookings and orders.
                    </p>
                  </div>
                  {notifications.length > 0 && (
                    <span className="text-xs text-gray-400 font-medium shrink-0">
                      {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {[
                    { key: "all", label: "All" },
                    { key: "bookings", label: "Bookings" },
                    { key: "orders", label: "Orders" },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setFilter(f.key)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        filter === f.key
                          ? "bg-[#1d242d] text-white"
                          : "bg-gray-50 text-gray-500 border border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-8 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-100 rounded w-1/3" />
                          <div className="h-3 bg-gray-50 rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BellOff className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-700 mb-1">No notifications yet</p>
                    <p className="text-sm text-gray-400">
                      You'll see updates about your bookings and orders here.
                    </p>
                  </div>
                ) : (
                  <>
                    {todayItems.length > 0 && (
                      <div>
                        <div className="px-5 sm:px-6 pt-4 pb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Today</p>
                        </div>
                        {todayItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => item.link && router.push(item.link)}
                            className="w-full text-left px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors flex gap-3.5"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconStyle(item.type)}`}>
                              {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-[#1d242d] truncate">{item.title}</p>
                                <span className="text-[11px] text-gray-400 shrink-0">{formatTime(item.time)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {earlierItems.length > 0 && (
                      <div>
                        <div className="px-5 sm:px-6 pt-4 pb-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Earlier</p>
                        </div>
                        {earlierItems.map(item => (
                          <button
                            key={item.id}
                            onClick={() => item.link && router.push(item.link)}
                            className="w-full text-left px-5 sm:px-6 py-4 hover:bg-gray-50/50 transition-colors flex gap-3.5"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconStyle(item.type)}`}>
                              {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-[#1d242d] truncate">{item.title}</p>
                                <span className="text-[11px] text-gray-400 shrink-0">{formatTime(item.time)}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
