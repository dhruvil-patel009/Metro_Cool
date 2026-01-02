import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
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
    <Card className="relative overflow-hidden p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>

      {/* Change Indicator */}
      <div className="mt-4 flex items-center gap-1.5">
        {change !== "0%" && (
          <>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-gray-400" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-gray-500"}`}>{change}</span>
          </>
        )}
      </div>
    </Card>
  )
}
