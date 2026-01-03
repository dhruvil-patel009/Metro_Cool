"use client"

import { type LucideIcon, TrendingUp, Minus } from "lucide-react"
import { Card } from "@/app/components/ui/card"

interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  value: string
  change: string
  isPositive: boolean
}

export function StatCard({ icon: Icon, iconColor, iconBg, title, value, change, isPositive }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      {/* Change Indicator */}
      <div className="mt-4 flex items-center gap-1.5">
        {change !== "0%" ? (
          <>
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            <span className="text-sm font-semibold text-green-600">{change}</span>
          </>
        ) : (
          <>
            <Minus className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">{change}</span>
          </>
        )}
      </div>
    </Card>
  )
}
