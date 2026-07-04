"use client";

import { Calendar } from "lucide-react";
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
        <div className="text-slate-500 font-semibold animate-pulse">
          Fetching technician dashboard...
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-red-500 font-semibold">
        Failed to load jobs. Please login again.
      </div>
    )
  }

  const serverDate = dayjs(serverTime)
  const today = serverDate.format("dddd, MMM D")

  const todayJobs = bookings.filter((job: any) =>
    dayjs(job.booking_date).isSame(serverDate, "day")
  )

  const authStorage = JSON.parse(localStorage.getItem("auth-storage") || "{}")
  const technicianName = authStorage?.state?.user?.firstName || "Technician"

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Welcome back, {technicianName} 👋
          </h1>
          <div className="flex items-center py-4 gap-4 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{today}</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-sm">
              You have{" "}
              <span className="text-blue-500 font-bold">{todayJobs.length}</span>{" "}
              jobs today
            </p>
          </div>
        </div>
      </section>

      <StatCards bookings={bookings} stats={stats} />
      <JobList bookings={bookings} serverTime={serverTime} />
    </>
  )
}
