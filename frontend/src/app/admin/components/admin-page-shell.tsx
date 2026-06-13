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
    <div className={cn("min-h-full bg-gray-50/40", className)}>
      <div className="p-5 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-500 mt-1.5">{description}</p>
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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg" />
      ) : (
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      )}
      {sub && !loading && (
        <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
      )}
    </div>
  )
}
