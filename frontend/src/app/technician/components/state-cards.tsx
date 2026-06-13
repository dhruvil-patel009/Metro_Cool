import { IndianRupee, CheckCircle2, Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils"
import dayjs from "dayjs"

interface StatsFromAPI {
  completed:    number
  pending:      number
  today:        number
  totalEarned:  number
}

export function StatCards({
  bookings,
  stats,
}: {
  bookings: any[]
  stats?: StatsFromAPI
}) {
  const today = dayjs().format("YYYY-MM-DD")

  // Use real stats from API if available, fall back to local calculation
  const completed    = stats?.completed    ?? bookings.filter(j => j.job_status === "completed").length
  const pending      = stats?.pending      ?? bookings.filter(j => j.job_status === "open").length
  const todayJobs    = stats?.today        ?? bookings.filter(j => j.booking_date?.slice(0, 10) === today).length
  const totalEarnings = stats?.totalEarned ?? bookings
    .filter(j => j.job_status === "completed" && j.total_amount)
    .reduce((sum, j) => sum + Number(j.total_amount || 0), 0)

  const inProgress = bookings.filter(j =>
    ["assigned", "on_the_way", "working"].includes(j.job_status)
  ).length

  const totalJobs = Math.max(completed + pending + inProgress, 1)

  const statItems = [
    {
      title: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      trend: completed > 0 ? `${completed} paid` : "—",
      trendLabel: "completed jobs",
      icon: IndianRupee,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      progress: Math.min(100, (completed / Math.max(bookings.length, 1)) * 100),
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
      progress: Math.min(100, (completed / Math.max(bookings.length, 1)) * 100),
      progressBar: "bg-emerald-500",
    },
    {
      title: "Pending Jobs",
      value: String(pending),
      trend: pending > 0 ? "Needs attention" : "All clear",
      trendLabel: "",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      progress: Math.min(100, (pending / Math.max(bookings.length, 1)) * 100),
      progressBar: "bg-orange-500",
    },
    {
      title: "Today's Jobs",
      value: String(todayJobs),
      trend: inProgress > 0 ? `${inProgress} active` : "Scheduled",
      trendLabel: "",
      icon: Calendar,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      progress: Math.min(100, (todayJobs / Math.max(bookings.length, 1)) * 100),
      progressBar: "bg-blue-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 py-6 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-[11px] font-bold px-1.5 py-0.5 rounded",
                  stat.trend.includes("+")
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.trend === "Needs attention"
                    ? "bg-orange-50 text-orange-600"
                    : "bg-blue-50 text-blue-600",
                )}>
                  {stat.trend}
                </span>
                {stat.trendLabel && (
                  <span className="text-[11px] text-muted-foreground">{stat.trendLabel}</span>
                )}
              </div>
            </div>

            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", stat.progressBar)}
                style={{ width: `${stat.progress}%` }}
              />
            </div>

            <stat.icon className={cn(
              "absolute -bottom-2 -right-2 w-16 h-16 opacity-[0.03]",
              stat.iconColor
            )} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
