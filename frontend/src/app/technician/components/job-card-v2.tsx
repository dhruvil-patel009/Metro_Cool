"use client"

import {
  MapPin,
  User,
  Calendar,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"


interface JobCardProps {
  id: string
  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed" | "cancelled" | "report_submitted"
  title: string
  customer: string
  location: string
  dateTime: string
  distance: string
  mapUrl?: string
}

export function JobCardV2({
  id,
  job_status,
  title,
  customer,
  location,
  dateTime,
  distance,
  mapUrl,
}: JobCardProps) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [clicked, setClicked] = useState(false)
  const queryClient = useQueryClient()

  const acceptJob = async () => {
    if (clicked) return
    setClicked(true)
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tech-jobs/${id}/accept`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        setClicked(false)
        setLoading(false)
        return
      }

      await queryClient.invalidateQueries({ queryKey: ["technician-jobs"] })
      await queryClient.invalidateQueries({ queryKey: ["technician-all-jobs"] })
      router.push(`/technician/jobs/${id}`)
    } catch (err) {
      console.error(err)
      setClicked(false)
      setLoading(false)
      alert("Server error")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row group transition-shadow hover:shadow-md"
    >
      {/* LEFT BORDER ACCENT */}
      <div className="hidden md:block w-1.5 bg-blue-600 shrink-0" />

      {/* IMAGE SECTION - top on mobile, right on desktop */}
      <div className="relative overflow-hidden h-44 sm:h-52 md:h-auto md:w-64 lg:w-80 md:order-2 bg-slate-100 shrink-0">
        {mapUrl ? (
          <img
            src={mapUrl}
            alt="Service"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full min-h-[180px] flex items-center justify-center text-slate-400 text-sm font-medium">
            No Image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between md:order-1">
        <div>
          {/* Header badges */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider">
                {job_status === "open" ? "New Request" :
                 job_status === "assigned" ? "Assigned" :
                 job_status === "on_the_way" ? "On The Way" :
                 job_status === "working" ? "In Progress" :
                 job_status === "completed" ? "Completed" :
                 job_status === "report_submitted" ? "Reported" :
                 job_status === "cancelled" ? "Cancelled" : job_status}
              </span>
              <span className="text-[11px] font-medium text-slate-400 truncate">
                #JOB-{id.slice(0, 8)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 line-clamp-2">
            {title}
          </h3>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-y-4 sm:gap-x-8">
            {/* CUSTOMER */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Customer
                </span>
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {customer}
                </span>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Date & Time
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {dateTime}
                </span>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Location
                </span>
                <span className="text-sm font-semibold text-slate-700 line-clamp-2">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 sm:mt-8">
          {job_status === "open" && (
            <Button
              onClick={acceptJob}
              disabled={loading || clicked}
              className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold gap-2 text-sm sm:text-base shadow-lg shadow-cyan-100 w-full sm:w-auto"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? "Accepting..." : "Accept Job"}
            </Button>
          )}

          {job_status === "assigned" && (
            <Link href={`/technician/jobs/${id}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold w-full sm:w-auto">
                ON THE WAY
              </Button>
            </Link>
          )}

          {job_status === "on_the_way" && (
            <Link href={`/technician/jobs/${id}`}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold w-full sm:w-auto">
                START WORK
              </Button>
            </Link>
          )}

          {job_status === "working" && (
            <Link href={`/technician/jobs/${id}`}>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold w-full sm:w-auto">
                CONTINUE WORK
              </Button>
            </Link>
          )}

          {job_status === "completed" && (
            <Link href={`/technician/jobs/${id}`}>
              <Button className="bg-slate-700 hover:bg-slate-800 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold w-full sm:w-auto">
                VIEW DETAILS
              </Button>
            </Link>
          )}

          {job_status === "report_submitted" && (
            <Link href={`/technician/jobs/${id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-bold w-full sm:w-auto">
                VIEW REPORT
              </Button>
            </Link>
          )}

          {job_status === "cancelled" && (
            <span className="inline-flex items-center gap-2 text-red-500 text-sm font-bold px-4 py-2">
              <CheckCircle2 className="w-4 h-4" />
              Cancelled
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
