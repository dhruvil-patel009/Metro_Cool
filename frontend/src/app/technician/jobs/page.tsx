"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/app/lib/utils"
import { JobCardV2 } from "../components/job-card-v2"
import { useSearchParams } from "next/navigation"


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

  // IMPORTANT CHANGE
  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed"
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
  const [jobs, setJobs] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

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

    return `${a.street ?? ""}, ${a.city ?? ""}`.trim() || "—"
  }

  const getFullAddress = (address: any) => {
    const a = parseAddress(address)
    if (!a) return ""

    return [
      a.street,
      a.apt,
      a.city,
      a.zipCode,
    ]
      .filter(Boolean)
      .join(", ")
  }

  /* ================= FETCH BOOKINGS ================= */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        )

        const json = await res.json()
        if (json.success) {
          console.log("API BOOKINGS:", json.bookings)
          setJobs(json.bookings)
        }
      } catch (err) {
        console.error("Failed to load jobs", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])
  /* ================= FILTERS ================= */

  const tabFilteredJobs = jobs.filter((job) => {

    // jobs waiting for technician
    if (activeTab === "new") return job.job_status === "open"

    // technician accepted & in progress
    if (activeTab === "accepted")
      return (
        job.job_status === "assigned" ||
        job.job_status === "on_the_way" ||
        job.job_status === "working"
      )

    // finished jobs
    if (activeTab === "completed") return job.job_status === "completed"

    return true
  })



  const filteredJobs = tabFilteredJobs.filter(
    (job) =>
      job.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.includes(searchQuery),
  )

  const tabs = [
    {
      id: "new",
      label: "New Jobs",
      count: jobs.filter(j => j.job_status === "open").length,
    },
    {
      id: "accepted",
      label: "Accepted Jobs",
      count: jobs.filter(j =>
        j.job_status === "assigned" ||
        j.job_status === "on_the_way" ||
        j.job_status === "working"
      ).length,
    },
    {
      id: "completed",
      label: "Completed Jobs",
      count: jobs.filter(j => j.job_status === "completed").length,
    },
  ]



  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Jobs
          </h1>
          <p className="text-slate-500 font-medium">
            Manage and track your daily assignments
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            className="pl-12 bg-white border-slate-200 h-14 rounded-2xl shadow-sm"
            placeholder="Search by customer or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all relative",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-black",
                activeTab === tab.id
                  ? "bg-[#ecfeff] text-[#0891b2]"
                  : "bg-slate-200 text-slate-500",
              )}
            >
              {tab.count}
            </span>

            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl -z-10"
              />
            )}
          </button>
        ))}
      </div>

      {/* ================= JOB LIST ================= */}
      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {!loading &&
            filteredJobs.map((job) => {
              const fullAddress = getFullAddress(job.address)

              return (
                <motion.div key={job.id} layout className="space-y-4">
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
              )
            })}
        </AnimatePresence>

        {!loading && filteredJobs.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              No jobs found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
