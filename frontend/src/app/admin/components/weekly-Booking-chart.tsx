"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 95 },
  { day: "Wed", value: 110 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 130 },
  { day: "Sat", value: 145 },
  { day: "Sun", value: 75 },
]

export function WeeklyBookingsChart() {
  return (
    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Weekly Bookings</CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-500">Total bookings per day</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-500">145</p>
            <p className="text-xs text-gray-400">This Week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis hide />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="#22d3ee"
                  className="transition-opacity duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
