"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts"

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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Weekly Earnings</CardTitle>
            <CardDescription>Income trend this week</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">$12,450</p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22d3ee"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
