"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/app/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/app/lib/utils"
import { JobCardV2 } from "../components/job-card-v2"

const jobs = [
  {
    id: "2938",
    title: "AC System Repair - Unit 4B",
    customer: "John Doe",
    location: "123 Pine St, Downtown Seattle, WA",
    dateTime: "Oct 24, 2:00 PM",
    distance: "2.4 mi",
    mapUrl: "/map-of-seattle-downtown.jpg",
  },
  {
    id: "2941",
    title: "Emergency Leak Repair",
    customer: "Sarah Jenkins",
    location: "892 West Ave, Belltown, Seattle, WA",
    dateTime: "Oct 24, 4:30 PM",
    distance: "5.1 mi",
    mapUrl: "/map-of-belltown-seattle.jpg",
  },
  {
    id: "2945",
    title: "Commercial Boiler Inspection",
    customer: "TechGlobal Inc.",
    location: "400 Broad St, Seattle Center, WA",
    dateTime: "Oct 25, 9:00 AM",
    distance: "0.8 mi",
    mapUrl: "/map-of-seattle-center.jpg",
  },
]

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.includes(searchQuery),
  )

  const tabs = [
    { id: "new", label: "New Jobs", count: 3 },
    { id: "accepted", label: "Accepted Jobs", count: 1 },
    { id: "completed", label: "Completed Jobs", count: 12 },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Jobs</h1>
          <p className="text-slate-500 font-medium">Manage and track your daily assignments</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            className="pl-12 bg-white border-slate-200 h-14 rounded-2xl shadow-sm focus:ring-[#0891b2] focus:border-[#0891b2] transition-all"
            placeholder="Search by customer, city, or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative",
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-[10px] font-black",
                activeTab === tab.id ? "bg-[#ecfeff] text-[#0891b2]" : "bg-slate-200 text-slate-500",
              )}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job) => (
            <motion.div key={job.id} layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
              <JobCardV2 {...job} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredJobs.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No jobs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
