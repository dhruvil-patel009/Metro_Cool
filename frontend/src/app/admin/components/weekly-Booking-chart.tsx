"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface DayData {
  date: string
  day: string
  count: number
}

export function WeeklyBookingsChart() {
  const [data, setData] = useState<DayData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_URL}/admin/bookings/weekly-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch")

        const json = await res.json()
        setData(json.chartData || [])
        setTotal(json.total || 0)
      } catch {
        setError(true)
        // Fallback: show empty 7-day skeleton so chart doesn't disappear
        const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const fallback: DayData[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          fallback.push({
            date: d.toLocaleDateString("en-CA"),
            day: DAYS[d.getDay()],
            count: 0,
          })
        }
        setData(fallback)
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const maxVal = Math.max(...data.map(d => d.count), 1)

  // Today's date string for highlighting today's bar
  const todayStr = new Date().toLocaleDateString("en-CA")

  return (
    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Weekly Bookings</CardTitle>
            <CardDescription className="mt-0.5 text-sm text-gray-500">
              Last 7 days · {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </CardDescription>
          </div>
          <div className="text-right">
            {loading
              ? <div className="h-8 w-10 bg-gray-100 animate-pulse rounded" />
              : <p className="text-2xl font-bold text-cyan-500">{total}</p>
            }
            <p className="text-xs text-gray-400 mt-0.5">This Week</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : error && total === 0 ? (
          <div className="h-[240px] flex flex-col items-center justify-center text-gray-400 gap-2">
            <p className="text-sm">Could not load chart data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} barCategoryGap="28%">
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                hide
                allowDecimals={false}
                domain={[0, maxVal + 1]}
              />
              <Tooltip
                cursor={{ fill: "rgba(34,211,238,0.07)", radius: 6 }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 13,
                  padding: "8px 14px",
                }}
                formatter={(v: number | undefined) => [v ?? 0, "Bookings"] as [number, string]}
                labelFormatter={(_, payload) => {
                  if (payload?.[0]?.payload?.date) {
                    return new Date(payload[0].payload.date + "T00:00:00").toLocaleDateString("en-IN", {
                      weekday: "short", day: "numeric", month: "short"
                    })
                  }
                  return ""
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {data.map((entry, i) => {
                  const isToday = entry.date === todayStr
                  const isPeak = entry.count === maxVal && maxVal > 0
                  return (
                    <Cell
                      key={i}
                      fill={isToday ? "#0ea5e9" : isPeak ? "#38bdf8" : "#bae6fd"}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        {!loading && (
          <div className="flex items-center gap-4 mt-3 justify-end text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-200 inline-block" />
              Other days
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />
              Peak day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
              Today
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
