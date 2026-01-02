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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Weekly Bookings</CardTitle>
            <CardDescription>Total bookings per day</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-600">145</p>
            <p className="text-xs text-gray-500">This Week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#22d3ee" opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
