import { DollarSign, CheckCircle2, Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils"
import dayjs from "dayjs";

const stats = [
  {
    title: "Total Earnings",
    value: "$1,240",
    trend: "+12%",
    trendLabel: "vs last week",
    icon: DollarSign,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    progress: 65,
    progressBar: "bg-cyan-500",
  },
  {
    title: "Completed Jobs",
    value: "12",
    trend: "+2",
    trendLabel: "today",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    progress: 80,
    progressBar: "bg-emerald-500",
  },
  {
    title: "Pending Jobs",
    value: "3",
    trend: "Needs attention",
    trendLabel: "",
    icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    progress: 40,
    progressBar: "bg-orange-500",
  },
  {
    title: "Today's Jobs",
    value: "4",
    trend: "Active",
    trendLabel: "",
    icon: Calendar,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    progress: 50,
    progressBar: "bg-blue-500",
  },
]

export function StatCards({bookings}: any) {
    const completed = bookings.filter((j:any)=> j.job_status==="completed").length;
  const pending = bookings.filter((j:any)=> j.job_status==="assigned").length;
  // const today = bookings.filter((j:any)=> dayjs(j.scheduled_date).isToday()).length;
  return (
    <div className="grid grid-cols-1 py-6 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm overflow-hidden group">
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded",
                    stat.trend.includes("+")
                      ? "bg-emerald-50 text-emerald-600"
                      : stat.trend === "Needs attention"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-blue-50 text-blue-600",
                  )}
                >
                  {stat.trend}
                </span>
                <span className="text-[11px] text-muted-foreground">{stat.trendLabel}</span>
              </div>
            </div>

            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", stat.progressBar)}
                style={{ width: `${stat.progress}%` }}
              />
            </div>

            {/* Background Icon Decoration */}
            <stat.icon className={cn("absolute -bottom-2 -right-2 w-16 h-16 opacity-[0.03]", stat.iconColor)} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
