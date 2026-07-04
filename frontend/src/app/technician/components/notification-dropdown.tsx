"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bell, Briefcase, CheckCircle2, Clock, MapPin,
  AlertCircle, Loader2, X,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"

dayjs.extend(relativeTime)

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

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

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["technician-notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  const unreadCount = notifications.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 rounded-full text-[10px] font-bold text-white px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading && (
              <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-xs font-medium">Loading…</p>
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                <Bell className="w-8 h-8 text-slate-200" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            )}

            {!isLoading && notifications.length > 0 && (
              <div className="divide-y divide-slate-50">
                {notifications.slice(0, 15).map((n) => {
                  const cfg = typeConfig[n.type] || typeConfig.job
                  const Icon = cfg.icon
                  return (
                    <Link
                      key={n.id}
                      href={n.booking_id ? `/technician/jobs/${n.booking_id}` : "/technician/jobs"}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer",
                        !n.read && "bg-blue-50/30"
                      )}>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                          <Icon className={cn("w-4 h-4", cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                            {!n.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">{dayjs(n.time).fromNow()}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 p-2">
              <Link href="/technician/jobs" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-9">
                  View All Jobs
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
