"use client";

import { Calendar, Zap, TrendingUp } from "lucide-react";
import { StatCards } from "./components/state-cards";
import { JobList } from "./components/job-list";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

const fetchStats = async () => {
  const res = await fetch(`${API}/technician/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return { completed: 0, pending: 0, today: 0, totalEarned: 0 }
  return res.json()
}

const fetchDashboardJobs = async () => {
  const token = getToken()
  const headers = { Authorization: `Bearer ${token}` }

  const [myRes, openRes] = await Promise.all([
    fetch(`${API}/tech-jobs/my`, { headers, cache: "no-store" }),
    fetch(`${API}/tech-jobs/open`, { headers, cache: "no-store" }),
  ])

  const myData = myRes.ok ? await myRes.json() : { bookings: [], serverTime: new Date().toISOString() }
  const openData = openRes.ok ? await openRes.json() : { bookings: [] }

  const myBookings = Array.isArray(myData.bookings) ? myData.bookings : []
  const openBookings = Array.isArray(openData.bookings) ? openData.bookings : []

  // Merge and deduplicate
  const seen = new Set<string>()
  const merged: any[] = []
  for (const b of [...myBookings, ...openBookings]) {
    if (!seen.has(b.id)) {
      seen.add(b.id)
      merged.push(b)
    }
  }

  return {
    bookings: merged,
    serverTime: myData.serverTime || new Date().toISOString(),
  }
}

export default function Dashboard() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["technician-jobs"],
    queryFn: fetchDashboardJobs,
    refetchInterval: 30000,
  })

  const { data: stats } = useQuery({
    queryKey: ["technician-stats"],
    queryFn: fetchStats,
    staleTime: 30_000,
  })

  const bookings = data?.bookings ?? []
  const serverTime = data?.serverTime ?? new Date().toISOString()

  if (isLoading || !data) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-600 font-bold text-lg">Connection Error</p>
          <p className="text-slate-400 text-sm mt-1">Failed to load jobs. Please login again.</p>
        </div>
      </div>
    )
  }

  const serverDate = dayjs(serverTime)
  const today = serverDate.format("dddd, D MMMM YYYY")

  const todayJobs = bookings.filter((job: any) =>
    dayjs(job.booking_date).isSame(serverDate, "day")
  )

  const openJobs = bookings.filter((job: any) => job.job_status === "open")

  const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}")
  const technicianName = authStorage?.state?.user?.firstName || "Technician"

  return (
    <div className="space-y-6">
      {/* ═══ WELCOME SECTION ═══ */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 sm:p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-cyan-500/10 rounded-full -mb-16" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-300 text-sm font-medium">Good {getGreeting()},</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {technicianName} 👋
            </h1>
            <div className="flex items-center gap-4 mt-3 text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{today}</span>
              </div>
            </div>
          </div>

          {/* Quick stats pills */}
          <div className="flex items-center gap-3">
            {todayJobs.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  {todayJobs.length} job{todayJobs.length !== 1 ? "s" : ""} today
                </span>
              </div>
            )}
            {openJobs.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-amber-400/20">
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-amber-100">
                  {openJobs.length} new available
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ STAT CARDS ═══ */}
      <StatCards bookings={bookings} stats={stats} />

      {/* ═══ JOB LIST ═══ */}
      <JobList bookings={bookings} serverTime={serverTime} />
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}
