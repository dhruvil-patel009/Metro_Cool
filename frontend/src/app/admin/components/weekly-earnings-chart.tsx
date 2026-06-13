"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const formatINR = (v: number) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)
  return `\u20B9${formatted}`
}

export function WeeklyEarningsChart() {
  const [data, setData] = useState<{ day: string; value: number; date?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [weekTotal, setWeekTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_URL}/admin/bookings/weekly-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch")

        const json = await res.json()
        setData(json.chartData || [])
        setWeekTotal(json.total || 0)
      } catch {
        const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        setData(DAYS.map(day => ({ day, value: 0 })))
        setWeekTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Revenue</CardTitle>
            <CardDescription className="mt-0.5 text-sm text-gray-500">
              Last 7 days · completed bookings
            </CardDescription>
          </div>
          <div className="text-right">
            {loading
              ? <div className="h-8 w-24 bg-gray-100 animate-pulse rounded" />
              : <p className="text-2xl font-bold text-emerald-500">{formatINR(weekTotal)}</p>}
            <p className="text-xs text-gray-400 mt-0.5">This Week</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "#6b7280" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 13 }}
                formatter={(v: number | undefined) => [formatINR(v ?? 0), "Revenue"] as [string, string]}
                labelFormatter={(_, payload) => {
                  const date = payload?.[0]?.payload?.date
                  if (date) {
                    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
                      weekday: "short", day: "numeric", month: "short",
                    })
                  }
                  return ""
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
