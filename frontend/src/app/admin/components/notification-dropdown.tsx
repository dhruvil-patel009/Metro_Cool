"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bell, Check, X, Calendar, DollarSign, Users, AlertCircle } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface Notification {
  id: string
  type: "booking" | "payment" | "technician" | "system"
  title: string
  message: string
  time: string
  read: boolean
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "New Booking Request",
    message: "John Doe requested AC Repair service for Oct 24, 2023",
    time: "2 minutes ago",
    read: false,
    icon: Calendar,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "Payment of $150.00 received for booking #BK-8892",
    time: "1 hour ago",
    read: false,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: DollarSign,
  },
  {
    id: "3",
    type: "technician",
    title: "New Technician Request",
    message: "Emily Chen applied as a Heat Specialist technician",
    time: "3 hours ago",
    read: false,
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "4",
    type: "booking",
    title: "Booking Completed",
    message: "Mike K. completed Duct Cleaning service for Sarah Jenkins",
    time: "5 hours ago",
    read: true,
    icon: Check,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: "5",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance on Oct 25, 2023 at 2:00 AM",
    time: "1 day ago",
    read: true,
    icon: AlertCircle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
]

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notificationList.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const markAsRead = (id: string) => {
    setNotificationList((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((notif) => notif.id !== id))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 animate-in fade-in slide-in-from-top-2 rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && <p className="text-xs text-gray-500">{unreadCount} unread notifications</p>}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-medium text-cyan-600 hover:text-cyan-700">
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notificationList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No notifications</p>
              </div>
            ) : (
              notificationList.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative border-b border-gray-100 p-4 transition-colors hover:bg-gray-50",
                    !notification.read && "bg-blue-50/50",
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn("flex-shrink-0 h-10 w-10 rounded-full p-2 align-middle", notification.iconBg)}>
                      <notification.icon className={cn("h-5 w-5", notification.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                        {!notification.read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                    </div>

                    {/* Actions (appear on hover) */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded p-1 hover:bg-gray-200"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded p-1 hover:bg-gray-200"
                        title="Delete"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notificationList.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-3 text-center">
              <button className="text-sm font-medium text-cyan-600 hover:text-cyan-700">View all notifications</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
