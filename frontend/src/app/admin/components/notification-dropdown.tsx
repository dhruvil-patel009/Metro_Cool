"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Bell, Check, X, Calendar, IndianRupee,
  Users, Loader2, RefreshCw, CheckCheck,
} from "lucide-react"
import { cn } from "@/app/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

type NotificationType = "booking" | "payment" | "technician"

interface RawNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

const TYPE_CONFIG: Record<NotificationType, {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
}> = {
  booking: {
    icon: Calendar,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  payment: {
    icon: IndianRupee,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  technician: {
    icon: Users,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
}

function timeAgo(isoString: string): string {
  const now = Date.now()
  const then = new Date(isoString).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return "yesterday"
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  })
}

// Poll every 60 seconds when the dropdown is open, every 5 min when closed
const POLL_OPEN_MS = 60_000
const POLL_CLOSED_MS = 5 * 60_000

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<RawNotification[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  /* ── Fetch ── */
  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications || [])
      setLastFetched(new Date())
    } catch {
      // silently fail — don't crash the header
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── Initial fetch ── */
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  /* ── Polling ── */
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(fetchNotifications, isOpen ? POLL_OPEN_MS : POLL_CLOSED_MS)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [isOpen, fetchNotifications])

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  /* ── Derived state ── */
  const visible = notifications.filter(n => !dismissedIds.has(n.id))
  const unreadCount = visible.filter(n => !readIds.has(n.id)).length

  const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]))
  const markAllRead = () => setReadIds(new Set(visible.map(n => n.id)))
  const dismiss = (id: string) => setDismissedIds(prev => new Set([...prev, id]))

  const handleOpen = () => {
    setIsOpen(v => !v)
    // Mark all as read when opening
    if (!isOpen) {
      setTimeout(() => markAllRead(), 2000)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[380px] rounded-2xl border border-gray-100 bg-white shadow-xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading ? "Loading…" : lastFetched
                  ? `Updated ${timeAgo(lastFetched.toISOString())}`
                  : "Live updates"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={fetchNotifications}
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-gray-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-400">Loading notifications…</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">All caught up!</p>
                <p className="text-xs text-gray-400">No new notifications in the last 48 hours</p>
              </div>
            ) : (
              <div>
                {visible.map((n, idx) => {
                  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.booking
                  const Icon = config.icon
                  const isRead = readIds.has(n.id)

                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "group relative flex gap-3 px-5 py-4 transition-colors cursor-default",
                        idx < visible.length - 1 && "border-b border-gray-50",
                        !isRead ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-gray-50"
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      {/* Icon */}
                      <div className={cn(
                        "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
                        config.iconBg
                      )}>
                        <Icon className={cn("w-4 h-4", config.iconColor)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm leading-snug",
                            !isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                          )}>
                            {n.title}
                          </p>
                          {!isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                          {timeAgo(n.time)}
                        </p>
                      </div>

                      {/* Dismiss button (on hover) */}
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-all"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {visible.length > 0 && (
            <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {visible.length} notification{visible.length !== 1 ? "s" : ""} · last 48h
              </p>
              <button
                onClick={() => setDismissedIds(new Set(visible.map(n => n.id)))}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
