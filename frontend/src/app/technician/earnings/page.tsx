"use client"

import { useMemo, useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import {
  Wallet, TrendingUp, Briefcase, BarChart2,
  Download, ChevronDown, Loader2, AlertCircle,
  IndianRupee, CalendarDays,
} from "lucide-react"

const API     = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

/* ── Fetch completed jobs for this technician ── */
const fetchBookings = async (): Promise<any[]> => {
  const res = await fetch(`${API}/technician/earnings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.bookings) ? json.bookings : []
}

/* ── Currency formatter ── */
const inr = (v: number) =>
  `₹${v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function EarningsPage() {
  const [period,   setPeriod]   = useState<"week" | "month">("month")
  const [showMore, setShowMore] = useState(false)

  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["technician-earnings"],
    queryFn:  fetchBookings,
    staleTime: 60_000,
  })

  /* ── Only completed jobs have earnings ── */
  const completed = useMemo(
    () => bookings.filter((b) => b.job_status === "completed" && b.total_amount),
    [bookings]
  )

  /* ── Period boundaries ── */
  const periodData = useMemo(() => {
    const now      = dayjs()
    const weekStart  = now.startOf("week")
    const monthStart = now.startOf("month")
    const prevWeekStart  = weekStart.subtract(1, "week")
    const prevMonthStart = monthStart.subtract(1, "month")

    const inPeriod = (b: any, start: dayjs.Dayjs, end: dayjs.Dayjs) => {
      const d = dayjs(b.booking_date)
      return d.isAfter(start.subtract(1, "day")) && d.isBefore(end.add(1, "day"))
    }

    const sum = (list: any[]) =>
      list.reduce((s, b) => s + Number(b.total_amount || 0), 0)

    const thisWeekJobs  = completed.filter((b) => inPeriod(b, weekStart, now))
    const prevWeekJobs  = completed.filter((b) => inPeriod(b, prevWeekStart, weekStart))
    const thisMonthJobs = completed.filter((b) => inPeriod(b, monthStart, now))
    const prevMonthJobs = completed.filter((b) => inPeriod(b, prevMonthStart, monthStart))

    const weekTotal  = sum(thisWeekJobs)
    const monthTotal = sum(thisMonthJobs)
    const prevWeek   = sum(prevWeekJobs)
    const prevMonth  = sum(prevMonthJobs)

    const growth = (curr: number, prev: number) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100)

    return {
      week: {
        total:       weekTotal,
        growth:      growth(weekTotal, prevWeek),
        jobs:        thisWeekJobs.length,
        avg:         thisWeekJobs.length ? weekTotal / thisWeekJobs.length : 0,
      },
      month: {
        total:       monthTotal,
        growth:      growth(monthTotal, prevMonth),
        jobs:        thisMonthJobs.length,
        avg:         thisMonthJobs.length ? monthTotal / thisMonthJobs.length : 0,
      },
    }
  }, [completed])

  const current = period === "week" ? periodData.week : periodData.month

  /* ── History list (latest first) ── */
  const history = useMemo(
    () => [...completed].sort((a, b) =>
      dayjs(b.booking_date).valueOf() - dayjs(a.booking_date).valueOf()
    ),
    [completed]
  )
  const visible = showMore ? history : history.slice(0, 7)

  /* ── All-time total ── */
  const allTimeTotal = completed.reduce((s, b) => s + Number(b.total_amount || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="font-medium">Loading earnings…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="font-medium text-red-500">Failed to load earnings data</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Earnings</h1>
          <p className="text-slate-500 mt-1">Track your performance and income</p>
        </div>

        {/* Period toggle */}
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm w-fit">
          {(["week", "month"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              onClick={() => setPeriod(p)}
              className={`transition-all duration-200 capitalize ${
                period === p
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-transparent text-slate-600 hover:bg-slate-50 shadow-none border-0"
              }`}
              variant={period === p ? "default" : "ghost"}
            >
              This {p === "week" ? "Week" : "Month"}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total earnings */}
        <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
              <Wallet className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {period === "week" ? "This Week" : "This Month"}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{inr(current.total)}</p>
          <Badge className={`border-0 text-xs font-bold ${
            current.growth >= 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {current.growth >= 0 ? "+" : ""}{current.growth}% vs last {period}
          </Badge>
        </Card>

        {/* Jobs completed */}
        <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Jobs Completed</span>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">{current.jobs}</p>
          <p className="text-xs text-slate-400 font-medium">in this {period}</p>
        </Card>

        {/* Average per job */}
        <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <BarChart2 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Avg. Per Job</span>
          </div>
          <p className="text-3xl font-black text-slate-900 mb-2">
            {current.jobs > 0 ? inr(current.avg) : "—"}
          </p>
          <p className="text-xs text-slate-400 font-medium">per completed job</p>
        </Card>

        {/* All-time total */}
        <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wide">All Time</span>
          </div>
          <p className="text-3xl font-black text-white mb-2">{inr(allTimeTotal)}</p>
          <p className="text-xs text-blue-200 font-medium">{completed.length} completed jobs</p>
        </Card>
      </div>

      {/* ── Earnings History ── */}
      <Card className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-slate-900">Earnings History</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {history.length} records
            </span>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <Wallet className="w-10 h-10 text-slate-200" />
            <p className="font-semibold">No completed jobs yet</p>
            <p className="text-sm text-slate-400">Earnings will appear here once jobs are completed</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {["Job ID", "Service", "Date", "Amount"].map((h) => (
                      <th key={h} className={`py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Amount" ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {visible.map((item, idx) => (
                    <tr key={item.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                      style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm font-semibold text-slate-700">
                          #{item.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-900 text-sm">
                          {item.services?.title || "AC Service"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.full_name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-600">
                          {dayjs(item.booking_date).format("DD MMM YYYY")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                          {inr(Number(item.total_amount || 0))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {visible.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {item.services?.title || "AC Service"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.full_name}</p>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">
                      {inr(Number(item.total_amount || 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-xs text-slate-400">
                      #{item.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {dayjs(item.booking_date).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more */}
            {history.length > 7 && (
              <div className="flex justify-center p-5 border-t border-slate-100">
                <Button
                  variant="ghost"
                  onClick={() => setShowMore(!showMore)}
                  className="gap-2 text-slate-600 hover:bg-slate-50"
                >
                  {showMore ? "Show Less" : `Show ${history.length - 7} More`}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`} />
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
