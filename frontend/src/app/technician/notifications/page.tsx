"use client"

import { useState } from "react"
import {
  Bell, Briefcase, CheckCircle2, Clock, MapPin,
  AlertCircle, Loader2,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"

dayjs.extend(relativeTime)

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined"
    ? ""
    : localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
  booking_id?: string
}

const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await fetch(`${API}/technician/notifications`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.notifications) ? json.notifications : []
}

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  new_job:     { icon: AlertCircle,  color: "text-amber-600",   bg: "bg-amber-100" },
  assigned:    { icon: Briefcase,    color: "text-blue-600",    bg: "bg-blue-100" },
  in_progress: { icon: Clock,        color: "text-cyan-600",    bg: "bg-cyan-100" },
  completed:   { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  job:         { icon: MapPin,       color: "text-slate-600",   bg: "bg-slate-100" },
}

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["technician-notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm font-medium">Loading notifications…</p>
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-base font-semibold text-slate-600">No notifications yet</p>
            <p className="text-sm text-slate-400">You're all caught up!</p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.job
              const Icon = cfg.icon
              return (
                <Link
                  key={n.id}
                  href={n.booking_id ? `/technician/jobs/${n.booking_id}` : "/technician/jobs"}
                >
                  <div
                    className={cn(
                      "flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer",
                      !n.read && "bg-blue-50/40"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        cfg.bg
                      )}
                    >
                      <Icon className={cn("w-5 h-5", cfg.color)} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                        {!n.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        {dayjs(n.time).fromNow()}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
