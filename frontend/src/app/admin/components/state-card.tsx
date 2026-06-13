"use client"

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  accentColor: string          // e.g. "#3b82f6"
  accentLight: string          // e.g. "#eff6ff"
  title: string
  value: string
  change: string
  isPositive: boolean
  // legacy compat props (unused but kept to avoid type errors)
  gradientFrom?: string
  gradientTo?: string
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  accentColor,
  accentLight,
  title,
  value,
  change,
  isPositive,
}: StatCardProps) {
  const isLoading = value === "—"

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default"
    >
      {/* Colored top border accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: accentColor }} />

      {/* Faint circle decoration */}
      <div
        className="absolute -right-5 -top-5 w-20 h-20 rounded-full opacity-[0.08]"
        style={{ background: accentColor }}
      />

      <div className="relative p-5">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: accentLight }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>

          {change && !isLoading && (
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full",
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-600"
            )}>
              {isPositive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>

        {/* Value */}
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-28 bg-gray-100 animate-pulse rounded-lg" />
            <div className="h-3.5 w-20 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : (
          <>
            <p className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">{value}</p>
            <p className="text-[12px] text-gray-400 mt-1.5 font-medium">{title}</p>
          </>
        )}
      </div>
    </div>
  )
}
