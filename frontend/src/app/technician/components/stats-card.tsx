import { DollarSign, CheckCircle2, AlertCircle, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"

const stats = [
  {
    title: "Total Earnings",
    value: "$2,450",
    change: "+12% last week",
    icon: DollarSign,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    title: "Completed Jobs",
    value: "42",
    change: "+4 this week",
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    title: "Pending Jobs",
    value: "5",
    subtitle: "Action Required",
    icon: AlertCircle,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
  {
    title: "New Requests",
    value: "3",
    badge: "High Priority",
    icon: Bell,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
  },
]

export function StatsCards() {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            {stat.change && (
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <span>↗</span> {stat.change}
              </p>
            )}
            {stat.subtitle && <p className="mt-1 text-xs text-muted-foreground">{stat.subtitle}</p>}
            {stat.badge && (
              <Badge variant="secondary" className="mt-2 bg-blue-50 text-primary hover:bg-blue-100">
                {stat.badge}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
