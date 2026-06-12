"use client"

import { useState, useMemo } from "react"
import {
  ChevronLeft, ChevronRight, Clock, MapPin, User,
  CalendarDays, Search, Filter, Loader2, AlertCircle,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { cn } from "@/app/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

/* ─── Types ─── */
type Address = { street?: string; apt?: string; city?: string; zipCode?: string }
type Booking = {
  id: string
  booking_date: string
  time_slot: string
  full_name: string
  phone: string
  address: Address | string | null
  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed" | "report_submitted"
  issues?: string[]
  total_amount?: number
  services?: { id: string; title: string; image_url: string; price: number }
}

/* ─── Constants ─── */
const DAYS   = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"]

/* ─── Status config ─── */
const STATUS: Record<string, { label: string; border: string; bg: string; badge: string; dot: string }> = {
  open:             { label: "Pending",     border: "border-amber-400",  bg: "hover:from-amber-50/50",  badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  assigned:         { label: "Assigned",    border: "border-blue-500",   bg: "hover:from-blue-50/50",   badge: "bg-blue-100 text-blue-700",     dot: "bg-blue-500 animate-pulse" },
  on_the_way:       { label: "On the Way",  border: "border-indigo-500", bg: "hover:from-indigo-50/50", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500 animate-pulse" },
  working:          { label: "In Progress", border: "border-cyan-500",   bg: "hover:from-cyan-50/50",   badge: "bg-cyan-100 text-cyan-700",     dot: "bg-cyan-500 animate-pulse" },
  report_submitted: { label: "Reported",    border: "border-purple-500", bg: "hover:from-purple-50/50", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  completed:        { label: "Completed",   border: "border-emerald-500",bg: "hover:from-emerald-50/50",badge: "bg-emerald-100 text-emerald-700",dot: "bg-emerald-500" },
}

/* ─── Calendar dot colours by status ─── */
const CAL_COLOR: Record<string, string> = {
  open: "bg-amber-400", assigned: "bg-blue-500", on_the_way: "bg-indigo-500",
  working: "bg-cyan-500", report_submitted: "bg-purple-500", completed: "bg-emerald-500",
}

/* ─── Helpers ─── */
const getToken = () => {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || ""
}

const parseAddress = (addr: any): Address | null => {
  if (!addr) return null
  if (typeof addr === "string") { try { return JSON.parse(addr) } catch { return null } }
  return addr
}

const fmtAddress = (addr: any) => {
  const a = parseAddress(addr)
  if (!a) return "—"
  return [a.street, a.city].filter(Boolean).join(", ") || "—"
}

/* ─── API fetch ─── */
const fetchBookings = async (): Promise<Booking[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.bookings) ? json.bookings : []
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════ */
export default function SchedulePage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [searchQuery,  setSearchQuery]  = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  /* ── Data ── */
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["technician-schedule"],
    queryFn: fetchBookings,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  /* ── Calendar helpers ── */
  const daysInMonth  = new Date(currentYear, currentMonth + 1, 0).getDate()
  const rawFirstDay  = new Date(currentYear, currentMonth, 1).getDay()
  const firstDay     = rawFirstDay === 0 ? 6 : rawFirstDay - 1  // Mon-start
  const prevDays     = firstDay > 0
    ? Array.from({ length: firstDay }, (_, i) =>
        new Date(currentYear, currentMonth, -firstDay + i + 1).getDate())
    : []

  /* ── Group bookings by date string "YYYY-MM-DD" ── */
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    bookings.forEach(b => {
      const d = b.booking_date?.slice(0, 10)
      if (!d) return
      if (!map[d]) map[d] = []
      map[d].push(b)
    })
    return map
  }, [bookings])

  const dateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0")
    const d = String(day).padStart(2, "0")
    return `${currentYear}-${m}-${d}`
  }

  const todayKey = today.toISOString().slice(0, 10)

  /* ── Upcoming / filtered list ── */
  const listBookings = useMemo(() => {
    let list = selectedDate
      ? (bookingsByDate[selectedDate] || [])
      : bookings.filter(b => {
          const d = b.booking_date?.slice(0, 10) || ""
          return d >= todayKey
        }).sort((a, b) => {
          if (a.booking_date < b.booking_date) return -1
          if (a.booking_date > b.booking_date) return 1
          return (a.time_slot || "").localeCompare(b.time_slot || "")
        })

    if (statusFilter !== "all") list = list.filter(b => b.job_status === statusFilter)
    if (searchQuery)
      list = list.filter(b =>
        b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.services?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    return list
  }, [bookings, bookingsByDate, selectedDate, statusFilter, searchQuery, todayKey])

  /* ── Navigation ── */
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
    setSelectedDate(null)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
    setSelectedDate(null)
  }

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <>
      {/* ── Header ── */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Schedule & Assignments
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Your upcoming jobs and appointments — live from the system.
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" /> Syncing…
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ════════════════ LEFT — CALENDAR ════════════════ */}
        <div className="xl:col-span-2">
          <Card className="p-6 border-slate-200 shadow-sm">

            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={prevMonth}
                  className="h-9 w-9 rounded-lg bg-transparent hover:bg-slate-100">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-bold text-slate-900 min-w-[160px] text-center">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <Button variant="outline" size="icon" onClick={nextMonth}
                  className="h-9 w-9 rounded-lg bg-transparent hover:bg-slate-100">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  ← Show all upcoming
                </button>
              )}
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-400 py-2 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Previous month ghost days */}
              {prevDays.map((d, i) => (
                <div key={`p-${i}`}
                  className="aspect-square rounded-xl flex items-start p-1.5 text-slate-300 text-xs font-medium">
                  {d}
                </div>
              ))}

              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const key     = dateKey(day)
                const jobs    = bookingsByDate[key] || []
                const isToday = key === todayKey
                const isSel   = key === selectedDate
                const hasJobs = jobs.length > 0

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSel ? null : key)}
                    className={cn(
                      "aspect-square rounded-xl flex flex-col items-start p-1.5 transition-all hover:shadow-md relative",
                      isToday && !isSel && "bg-blue-600 ring-2 ring-blue-600 ring-offset-1",
                      isSel     && "bg-blue-700 ring-2 ring-blue-500 ring-offset-1",
                      !isToday && !isSel && "bg-white border border-slate-100 hover:border-blue-300",
                    )}
                  >
                    <span className={cn(
                      "text-xs font-bold leading-none mb-1",
                      (isToday || isSel) ? "text-white" : "text-slate-700",
                    )}>
                      {day}
                    </span>

                    {/* Up to 2 dot indicators */}
                    {hasJobs && (
                      <div className="flex flex-wrap gap-0.5 mt-auto">
                        {jobs.slice(0, 3).map((j, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              CAL_COLOR[j.job_status] || "bg-slate-400"
                            )}
                          />
                        ))}
                        {jobs.length > 3 && (
                          <span className={cn(
                            "text-[8px] font-black",
                            (isToday || isSel) ? "text-white" : "text-slate-400"
                          )}>+{jobs.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Today label */}
                    {isToday && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                        Today
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-slate-100">
              {[
                { label: "Pending",     color: "bg-amber-400" },
                { label: "In Progress", color: "bg-cyan-500" },
                { label: "Completed",   color: "bg-emerald-500" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", color)} />
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ════════════════ RIGHT — FILTERS + LIST ════════════════ */}
        <div className="space-y-5">

          {/* Filter card */}
          <Card className="p-5 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900">Filter</h3>
            </div>
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  className="pl-9 bg-slate-50 border-slate-200 rounded-xl h-10 text-sm"
                  placeholder="Search name, ID, service…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status filter pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "all",       l: "All" },
                  { v: "open",      l: "Pending" },
                  { v: "assigned",  l: "Assigned" },
                  { v: "working",   l: "Working" },
                  { v: "completed", l: "Done" },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setStatusFilter(v)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold transition-all border",
                      statusFilter === v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Job list card */}
          <Card className="p-5 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-slate-900">
                  {selectedDate
                    ? `Jobs on ${new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                    : "Upcoming Jobs"}
                </h3>
              </div>
              {listBookings.length > 0 && (
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  {listBookings.length}
                </span>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="py-10 flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-sm font-medium">Loading schedule…</p>
              </div>
            )}

            {/* Error */}
            {isError && !isLoading && (
              <div className="py-8 flex flex-col items-center gap-2 text-slate-400">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <p className="text-sm font-medium text-red-500">Failed to load jobs</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && listBookings.length === 0 && (
              <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                <CalendarDays className="w-8 h-8 text-slate-200" />
                <p className="text-sm font-medium">
                  {selectedDate ? "No jobs on this date" : "No upcoming jobs"}
                </p>
              </div>
            )}

            {/* Job cards */}
            {!isLoading && !isError && (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {listBookings.map(job => {
                  const cfg = STATUS[job.job_status] || STATUS.open
                  const jobDate = new Date(job.booking_date + "T00:00:00")
                  const isToday = job.booking_date?.slice(0, 10) === todayKey
                  const isTomorrow = job.booking_date?.slice(0, 10) ===
                    new Date(Date.now() + 86400000).toISOString().slice(0, 10)

                  const dayLabel = isToday ? "TODAY" : isTomorrow ? "TOMORROW"
                    : jobDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" }).toUpperCase()

                  return (
                    <Link key={job.id} href={`/technician/jobs/${job.id}`}>
                      <div className={cn(
                        "p-4 rounded-2xl border-l-4 bg-gradient-to-r from-slate-50/60 to-transparent",
                        "transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer group",
                        cfg.border, cfg.bg,
                      )}>
                        {/* Day label */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                            {dayLabel}
                          </span>
                          <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg border-0", cfg.badge)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1 inline-block", cfg.dot)} />
                            {cfg.label}
                          </Badge>
                        </div>

                        {/* Time + title */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <p className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {job.services?.title || job.issues?.join(", ") || "AC Service"}
                            </p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                              {job.time_slot || "—"}
                            </p>
                          </div>
                          {job.total_amount && (
                            <span className="text-sm font-black text-emerald-600 shrink-0">
                              ₹{Number(job.total_amount).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Customer + location */}
                        <div className="space-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{job.full_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{fmtAddress(job.address)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Stats summary */}
          {!isLoading && bookings.length > 0 && (
            <Card className="p-5 border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">This Month</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Total Jobs",
                    value: bookings.filter(b => {
                      const d = b.booking_date?.slice(0, 7)
                      return d === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
                    }).length,
                    color: "text-slate-900",
                    bg: "bg-slate-50",
                  },
                  {
                    label: "Completed",
                    value: bookings.filter(b => {
                      const d = b.booking_date?.slice(0, 7)
                      const inMonth = d === `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
                      return inMonth && b.job_status === "completed"
                    }).length,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "In Progress",
                    value: bookings.filter(b =>
                      ["assigned","on_the_way","working"].includes(b.job_status)
                    ).length,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Pending",
                    value: bookings.filter(b => b.job_status === "open").length,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={cn("rounded-xl p-3 text-center", bg)}>
                    <p className={cn("text-2xl font-black", color)}>{value}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
