"use client"

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  gradientFrom: string
  gradientTo: string
  title: string
  value: string
  change: string
  isPositive: boolean
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  gradientFrom,
  gradientTo,
  title,
  value,
  change,
  isPositive,
}: StatCardProps) {
  const isLoading = value === "—"

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default">

      {/* Subtle gradient blob in corner */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.07] ${gradientFrom}`} />

      <div className="relative">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>

          {change && !isLoading && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-600"
            }`}>
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
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
            <p className="text-sm text-gray-400 mt-1 font-medium">{title}</p>
          </>
        )}
      </div>
    </div>
  )
}
