"use client"

import { IndianRupee, CheckCircle2, Clock, Calendar } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface StatsFromAPI {
  completed:   number
  pending:     number
  today:       number
  totalEarned: number
}

export function StatCards({
  bookings,
  stats,
}: {
  bookings: any[]
  stats?: StatsFromAPI
}) {
  const completed     = stats?.completed ?? 0
  const pending       = stats?.pending ?? 0
  const todayJobs     = stats?.today ?? 0
  const totalEarnings = stats?.totalEarned ?? 0

  const openJobs = bookings.filter(j => j.job_status === "open").length

  const statItems = [
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      subtitle: completed > 0 ? `${completed} jobs paid` : "No earnings yet",
      icon: IndianRupee,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      accentBg: "bg-emerald-500",
    },
    {
      title: "Completed",
      value: String(completed),
      subtitle: "jobs done",
      icon: CheckCircle2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      accentBg: "bg-blue-500",
    },
    {
      title: "In Progress",
      value: String(pending),
      subtitle: pending > 0 ? "active jobs" : "All clear",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      accentBg: "bg-orange-500",
    },
    {
      title: "Today's Jobs",
      value: String(todayJobs),
      subtitle: todayJobs > 0 ? "scheduled for today" : "No jobs today",
      icon: Calendar,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      borderColor: "border-violet-200",
      accentBg: "bg-violet-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statItems.map((stat) => (
        <div
          key={stat.title}
          className={cn(
            "relative bg-white rounded-2xl border shadow-sm p-4 sm:p-5 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5",
            stat.borderColor
          )}
        >
          {/* Top accent line */}
          <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-2xl", stat.accentBg)} />

          {/* Icon */}
          <div className={cn("w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 sm:mb-4", stat.iconBg)}>
            <stat.icon className={cn("w-5 h-5 sm:w-5.5 sm:h-5.5", stat.iconColor)} />
          </div>

          {/* Value */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-none">
            {stat.value}
          </p>

          {/* Title + subtitle */}
          <div className="mt-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-700">{stat.title}</p>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
