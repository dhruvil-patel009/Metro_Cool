"use client"

import { useEffect, useState } from "react"
import { StatCard } from "./components/state-card"
import { WeeklyEarningsChart } from "./components/weekly-earnings-chart"
import { WeeklyBookingsChart } from "./components/weekly-Booking-chart"
import { RecentBookingsTable } from "./components/recent-booking"
import { useAuthStore } from "@/store/auth.store"
import {
  CalendarDays, IndianRupee, Users, Briefcase,
  ArrowRight, TrendingUp, Zap,
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
  { label: "New Bookings",   href: "/admin/Bookings",    color: "bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20" },
  { label: "Pending Techs",  href: "/admin/Technician",  color: "bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 border border-violet-500/20" },
  { label: "Settlements",    href: "/admin/Settlements", color: "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20" },
  { label: "Settings",       href: "/admin/Settings",    color: "bg-slate-500/10 text-slate-300 hover:bg-slate-500/20 border border-slate-500/20" },
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
      accentColor: "#3b82f6",
      accentLight: "#eff6ff",
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
      accentColor: "#10b981",
      accentLight: "#ecfdf5",
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
      accentColor: "#8b5cf6",
      accentLight: "#f5f3ff",
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
      accentColor: "#f97316",
      accentLight: "#fff7ed",
      gradientFrom: "bg-orange-400",
      gradientTo: "bg-orange-600",
      title: "Completed Jobs",
      value: loading ? "—" : String(stats?.completed ?? 0),
      change: stats ? `${stats.pending} pending` : "",
      isPositive: false,
    },
  ]

  return (
    <div className="min-h-screen">
      <main className="p-5 lg:p-7 space-y-6 max-w-[1600px] mx-auto">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden rounded-2xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)"
          }}
        >
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)", transform: "translate(30%, -30%)" }}
          />
          <div className="absolute right-32 bottom-0 w-40 h-40 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #818cf8, transparent)", transform: "translateY(40%)" }}
          />

          <div className="relative flex items-center justify-between flex-wrap gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[11px] text-white/70 font-medium">Live</span>
                </div>
                <span className="text-white/50 text-[12px]">{todayDate}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Hello, {firstName} 👋
              </h2>
              <p className="text-blue-200/70 text-sm mt-1">
                Here’s what’s happening with Metro Cool today.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              {QUICK_LINKS.map(q => (
                <Link key={q.label} href={q.href}>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${q.color}`}>
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
                animation: "fadeInUp 0.3s ease-out both",
                animationDelay: `${index * 60}ms`,
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
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
