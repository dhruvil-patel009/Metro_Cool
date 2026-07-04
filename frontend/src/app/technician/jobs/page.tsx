"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/app/lib/utils"
import { JobCardV2 } from "../components/job-card-v2"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"



type Address = {
  street?: string
  apt?: string
  city?: string
  zipCode?: string
}

type Booking = {
  id: string
  booking_date: string
  time_slot: string
  full_name: string
  phone: string
  address: Address | string | null

  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed" | "cancelled" | "report_submitted"
  issues?: string[]

  services: {
    id: string
    title: string
    image_url: string
    price: number
  }
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get("tab") || "new"

  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ================= ADDRESS HELPERS ================= */

  const parseAddress = (address: any): Address | null => {
    if (!address) return null
    if (typeof address === "string") {
      try {
        return JSON.parse(address)
      } catch {
        return null
      }
    }
    return address
  }

  const getLocationText = (address: any) => {
    const a = parseAddress(address)
    if (!a) return "—"
    return [a.street, a.city].filter(Boolean).join(", ") || "—"
  }

  /* ================= FETCH BOOKINGS ================= */

  const fetchJobs = async (): Promise<Booking[]> => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_BASE_URL

      // Fetch open jobs (available to accept) + my jobs (accepted/in-progress)
      const [openRes, myRes] = await Promise.all([
        fetch(`${base}/tech-jobs/open`, { headers, cache: "no-store" }),
        fetch(`${base}/tech-jobs/my`, { headers, cache: "no-store" }),
      ])

      const openData = openRes.ok ? await openRes.json() : { bookings: [] }
      const myData = myRes.ok ? await myRes.json() : { bookings: [] }

      // Fetch completed jobs from bookings endpoint
      const completedRes = await fetch(`${base}/bookings`, { headers, cache: "no-store" })
      const completedData = completedRes.ok ? await completedRes.json() : { bookings: [] }

      // Combine: open + my non-completed + completed/cancelled from all
      const openBookings = Array.isArray(openData.bookings) ? openData.bookings : []
      const myBookings = Array.isArray(myData.bookings) ? myData.bookings : []
      const allBookings = Array.isArray(completedData.bookings) ? completedData.bookings : []

      // Merge and deduplicate by id
      const seen = new Set<string>()
      const merged: Booking[] = []

      for (const b of [...openBookings, ...myBookings, ...allBookings]) {
        if (!seen.has(b.id)) {
          seen.add(b.id)
          merged.push(b)
        }
      }

      return merged
    } catch (err) {
      console.error("Jobs fetch failed:", err)
      return []
    }
  }


  const {
    data: jobs = [],
    isLoading,
  } = useQuery({
    queryKey: ["technician-all-jobs"],
    queryFn: fetchJobs,
    enabled: mounted,
    refetchInterval: 5000,
    staleTime: 2000,
  })

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  /* ================= FILTERS ================= */

  const tabFilteredJobs = (jobs ?? []).filter((job) => {
    if (activeTab === "new") return job.job_status === "open"
    if (activeTab === "accepted")
      return (
        job.job_status === "assigned" ||
        job.job_status === "on_the_way" ||
        job.job_status === "working"
      )
    if (activeTab === "completed") return job.job_status === "completed" || job.job_status === "report_submitted"
    return true
  })

  const filteredJobs = tabFilteredJobs.filter(
    (job) =>
      job.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.includes(searchQuery),
  )

  const tabs = [
    {
      id: "new",
      label: "New Jobs",
      shortLabel: "New",
      count: jobs.filter(j => j.job_status === "open").length,
    },
    {
      id: "accepted",
      label: "Accepted Jobs",
      shortLabel: "Accepted",
      count: jobs.filter(j =>
        j.job_status === "assigned" ||
        j.job_status === "on_the_way" ||
        j.job_status === "working"
      ).length,
    },
    {
      id: "completed",
      label: "Completed Jobs",
      shortLabel: "Done",
      count: jobs.filter(j => j.job_status === "completed" || j.job_status === "report_submitted").length,
    },
  ]


  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            Jobs
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">
            Manage and track your daily assignments
          </p>
        </div>

        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            className="pl-12 bg-white border-slate-200 h-12 sm:h-14 rounded-2xl shadow-sm"
            placeholder="Search by customer or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex items-center gap-1 sm:gap-2 bg-slate-50/50 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-100 w-full sm:w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex-1 sm:flex-none justify-center",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span
              className={cn(
                "px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-black",
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-200 text-slate-500",
              )}
            >
              {tab.count}
            </span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg sm:rounded-xl -z-10"
              />
            )}
          </button>
        ))}
      </div>

      {/* LOADER */}
      {isLoading && (
        <div className="py-24 sm:py-32 text-center text-slate-400 font-semibold animate-pulse">
          Loading technician jobs...
        </div>
      )}

      {/* ================= JOB LIST ================= */}
      <div className="space-y-4 sm:space-y-6">
        <AnimatePresence mode="popLayout">
          {!isLoading && filteredJobs.map((job) => (
            <motion.div key={job.id} layout>
              <JobCardV2
                id={job.id}
                job_status={job.job_status}
                title={job.services?.title || job.issues?.join(", ") || "Service Job"}
                customer={job.full_name}
                location={getLocationText(job.address)}
                dateTime={`${job.booking_date} • ${job.time_slot}`}
                distance="—"
                mapUrl={job.services?.image_url}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {!isLoading && filteredJobs.length === 0 && (
          <div className="py-16 sm:py-20 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium text-sm sm:text-base">
              {searchQuery
                ? "No jobs found matching your search."
                : "No jobs in this category yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
