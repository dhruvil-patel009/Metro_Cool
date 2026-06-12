"use client"

import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { JobCard } from "./job-card"
import { Input } from "@/app/components/ui/input"
import { ArrowRight, CalendarIcon, Search, SlidersHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import Link from "next/link"

type StatusFilter = "all" | "open" | "assigned" | "on_the_way" | "working" | "completed"

export function JobList({ bookings, serverTime }: { bookings: any[]; serverTime: string }) {
  const [searchQuery,  setSearchQuery]  = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const today     = dayjs(serverTime).format("YYYY-MM-DD")
  const todayJobs = useMemo(
    () => bookings.filter((j) => j.booking_date?.slice(0, 10) === today),
    [bookings, today]
  )

  // Show today's jobs first.
  // If none today → show upcoming jobs (today or future), sorted by date asc.
  // Never show past jobs.
  const baseList = useMemo(() => {
    if (todayJobs.length > 0) return todayJobs
    return [...bookings]
      .filter((j) => {
        const d = j.booking_date?.slice(0, 10) ?? ""
        return d >= today && j.job_status !== "completed"
      })
      .sort((a, b) => {
        if (a.booking_date < b.booking_date) return -1
        if (a.booking_date > b.booking_date) return  1
        return (a.time_slot || "").localeCompare(b.time_slot || "")
      })
      .slice(0, 6)
  }, [todayJobs, bookings, today])

  const filtered = useMemo(() => {
    return baseList.filter((job) => {
      const matchStatus = statusFilter === "all" || job.job_status === statusFilter
      const q = searchQuery.toLowerCase()
      const matchSearch = !q ||
        (job.full_name || "").toLowerCase().includes(q) ||
        job.id.toLowerCase().includes(q) ||
        (job.services?.title || "").toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [baseList, statusFilter, searchQuery])

  const filterLabel: Record<StatusFilter, string> = {
    all:        "All Jobs",
    open:       "Pending",
    assigned:   "Assigned",
    on_the_way: "On the Way",
    working:    "Working",
    completed:  "Completed",
  }

  const sectionTitle = todayJobs.length > 0 ? "Today's Jobs" : "Upcoming Jobs"

  return (
    <div className="space-y-4 mt-6">
      {/* Search + Filter bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            className="pl-12 bg-white border-slate-200 h-12 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            placeholder="Search jobs, customers, services…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-6 font-bold cursor-pointer border-slate-200 text-slate-700 min-w-[150px] justify-between bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {filterLabel[statusFilter]}
              <ArrowRight className="w-4 h-4 ml-2 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {(Object.keys(filterLabel) as StatusFilter[]).map((key) => (
              <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                {filterLabel[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Section heading */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          {sectionTitle}
          <span className="text-sm font-semibold text-slate-400 ml-1">
            ({filtered.length})
          </span>
        </h3>
        <Link href="/technician/jobs">
          <Button variant="link" className="text-blue-500 font-bold text-sm cursor-pointer">
            View All Jobs
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Job cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 flex flex-col items-center gap-3 text-slate-400">
          <AlertCircle className="w-8 h-8 text-slate-200" />
          <p className="font-semibold">
            {searchQuery || statusFilter !== "all"
              ? "No jobs match your filter."
              : "No jobs scheduled for today."}
          </p>
          {(searchQuery || statusFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setStatusFilter("all") }}
              className="text-sm text-blue-500 font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        filtered.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  )
}
