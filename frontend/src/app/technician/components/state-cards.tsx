"use client"

import { IndianRupee, CheckCircle2, Clock, Calendar, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
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
  // Use API stats (real DB data) as primary source
  const completed     = stats?.completed ?? 0
  const pending       = stats?.pending ?? 0
  const todayJobs     = stats?.today ?? 0
  const totalEarnings = stats?.totalEarned ?? 0

  // Open jobs available to accept (from combined bookings array)
  const openJobs = bookings.filter(j => j.job_status === "open").length

  const totalJobs = Math.max(completed + pending + openJobs + todayJobs, 1)

  const statItems = [
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      trend: completed > 0 ? `${completed} paid` : "—",
      trendLabel: "completed jobs",
      icon: IndianRupee,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      progress: Math.min(100, (completed / totalJobs) * 100),
      progressBar: "bg-cyan-500",
    },
    {
      title: "Completed Jobs",
      value: String(completed),
      trend: completed > 0 ? `+${completed}` : "0",
      trendLabel: "total done",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      progress: Math.min(100, (completed / totalJobs) * 100),
      progressBar: "bg-emerald-500",
    },
    {
      title: "In Progress",
      value: String(pending),
      trend: pending > 0 ? `${pending} active` : "All clear",
      trendLabel: pending > 0 ? "jobs assigned" : "",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      progress: Math.min(100, (pending / totalJobs) * 100),
      progressBar: "bg-orange-500",
    },
    {
      title: "Today's Jobs",
      value: String(todayJobs),
      trend: todayJobs > 0 ? `${todayJobs} scheduled` : "No jobs today",
      trendLabel: "",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      progress: Math.min(100, (todayJobs / totalJobs) * 100),
      progressBar: "bg-blue-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 py-6 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {statItems.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className={cn("p-1.5 sm:p-2 rounded-lg", stat.iconBg)}>
                <stat.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", stat.iconColor)} />
              </div>
              <div className="text-right">
                <p className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider leading-tight">
                  {stat.title}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className={cn(
                  "text-[10px] sm:text-[11px] font-bold px-1 sm:px-1.5 py-0.5 rounded",
                  stat.trend.includes("+")
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.trend === "All clear" || stat.trend === "No jobs today"
                    ? "bg-blue-50 text-blue-600"
                    : stat.trend.includes("active") || stat.trend.includes("scheduled")
                    ? "bg-orange-50 text-orange-600"
                    : "bg-blue-50 text-blue-600",
                )}>
                  {stat.trend}
                </span>
                {stat.trendLabel && (
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground hidden sm:inline">{stat.trendLabel}</span>
                )}
              </div>
            </div>

            <div className="mt-4 sm:mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", stat.progressBar)}
                style={{ width: `${stat.progress}%` }}
              />
            </div>

            <stat.icon className={cn(
              "absolute -bottom-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 opacity-[0.03]",
              stat.iconColor
            )} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
