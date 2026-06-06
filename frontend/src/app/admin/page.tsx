"use client"

import { useEffect, useState } from "react"
import { StatCard } from "./components/state-card"
import { WeeklyEarningsChart } from "./components/weekly-earnings-chart"
import { WeeklyBookingsChart } from "./components/weekly-Booking-chart"
import { RecentBookingsTable } from "./components/recent-booking"
import { useAuthStore } from "@/store/auth.store"
import {
  CalendarDays, IndianRupee, Users, Briefcase,
  ArrowRight, Activity,
} from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

interface DashboardStats {
  today: number
  pending: number
  completed: number
  revenue: number
}

interface TechStats {
  total: number
  active: number
}

const QUICK_LINKS = [
  { label: "New Bookings",   href: "/admin/Bookings",    color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
  { label: "Pending Techs",  href: "/admin/Technician",  color: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
  { label: "Settlements",    href: "/admin/Settlements", color: "bg-amber-50 text-amber-600 hover:bg-amber-100" },
  { label: "Settings",       href: "/admin/Settings",    color: "bg-slate-50 text-slate-600 hover:bg-slate-100" },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [techStats, setTechStats] = useState<TechStats | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API_URL}/admin/bookings/stats`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/admin/technicians/stats`, { headers }).then(r => r.json()),
    ])
      .then(([bookingData, techData]) => {
        setStats(bookingData)
        setTechStats(techData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.firstName || "Admin"

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const statCards = [
    {
      icon: CalendarDays,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      gradientFrom: "bg-blue-400",
      gradientTo: "bg-blue-600",
      title: "Today's Bookings",
      value: loading ? "—" : String(stats?.today ?? 0),
      change: "",
      isPositive: true,
    },
    {
      icon: IndianRupee,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      gradientFrom: "bg-emerald-400",
      gradientTo: "bg-emerald-600",
      title: "Total Revenue",
      value: loading ? "—" : `₹${Number(stats?.revenue ?? 0).toLocaleString("en-IN")}`,
      change: "",
      isPositive: true,
    },
    {
      icon: Users,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50",
      gradientFrom: "bg-violet-400",
      gradientTo: "bg-violet-600",
      title: "Active Technicians",
      value: loading ? "—" : String(techStats?.active ?? 0),
      change: techStats ? `${techStats.total} total` : "",
      isPositive: true,
    },
    {
      icon: Briefcase,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      gradientFrom: "bg-orange-400",
      gradientTo: "bg-orange-600",
      title: "Completed Jobs",
      value: loading ? "—" : String(stats?.completed ?? 0),
      change: stats ? `${stats.pending} pending` : "",
      isPositive: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50/40">
      <main className="p-5 lg:p-8 space-y-7 max-w-[1600px] mx-auto">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg">
          {/* Decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute right-20 -bottom-10 w-28 h-28 rounded-full bg-white/5" />

          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-blue-200" />
                <span className="text-blue-200 text-sm font-medium">{todayDate}</span>
              </div>
              <h2 className="text-2xl font-bold">
                Hello, {firstName} 👋
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                Here's what's happening with Metro Cool today.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              {QUICK_LINKS.map(q => (
                <Link key={q.label} href={q.href}>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer backdrop-blur-sm border border-white/10">
                    {q.label}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              style={{
                animation: "fadeInUp 0.35s ease-out both",
                animationDelay: `${index * 70}ms`,
              }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid gap-5 lg:grid-cols-2">
          <WeeklyBookingsChart />
          <WeeklyEarningsChart />
        </div>

        {/* ── Recent Bookings ── */}
        <RecentBookingsTable />

      </main>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
