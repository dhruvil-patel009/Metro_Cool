"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface AdminPageShellProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AdminPageShell({
  title,
  description,
  action,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <div className={cn("min-h-full", className)}>
      <div className="p-5 lg:p-7 max-w-[1600px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </div>
  )
}

export function AdminLoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
      <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-gray-700 font-semibold">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>
      )}
    </div>
  )
}

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  iconBg?: string
  sub?: string
  loading?: boolean
}

export function AdminStatCard({
  label,
  value,
  icon,
  iconBg = "bg-blue-50",
  sub,
  loading,
}: AdminStatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      )}
      {sub && !loading && (
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{sub}</p>
      )}
    </div>
  )
}
