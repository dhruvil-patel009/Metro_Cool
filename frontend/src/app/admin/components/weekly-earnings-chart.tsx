"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts"

const data = [
  { day: "Mon", value: 8200 },
  { day: "Tue", value: 9800 },
  { day: "Wed", value: 9200 },
  { day: "Thu", value: 10800 },
  { day: "Fri", value: 11200 },
  { day: "Sat", value: 10900 },
  { day: "Sun", value: 12450 },
]

export function WeeklyEarningsChart() {
  return (
    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Weekly Earnings</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">Income trend this week</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-500">$12,450</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              // formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={1000}
              dot={{ fill: "#22d3ee", strokeWidth: 2, r: 4, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
