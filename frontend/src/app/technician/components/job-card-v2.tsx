"use client"

import {
  MapPin,
  User,
  Calendar,
  MoreVertical,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface JobCardProps {
  id: string
  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed"
  title: string
  customer: string
  location: string
  dateTime: string
  distance: string
  mapUrl?: string
}

export function JobCardV2({
  id,
  title,
  customer,
  location,
  dateTime,
  distance,
  mapUrl,
}: JobCardProps) {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

const [clicked, setClicked] = useState(false);

const acceptJob = async () => {
  // 🚨 Prevent double click + strict mode double call
  if (clicked) return;

  setClicked(true);
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tech-jobs/${id}/accept`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      setClicked(false);
      setLoading(false);
      return;
    }

    // redirect after success
    window.location.href = `/technician/jobs/${id}`;

  } catch (err) {
    console.error(err);
    setClicked(false);
    setLoading(false);
    alert("Server error");
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row h-full group transition-shadow hover:shadow-md"
    >
      {/* LEFT BORDER */}
      <div className="w-2 bg-[#0891b2] shrink-0" />

      {/* CONTENT */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#ecfeff] text-[#0891b2] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                New Request
              </span>
              <span className="text-xs font-medium text-slate-400">
                #JOB-{id}
              </span>
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
            >
              <MoreVertical className="w-4 h-4" />
            </Button> */}
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-[#0891b2] transition-colors">
            {title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {/* CUSTOMER */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Customer
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {customer}
                </span>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Date & Time
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {dateTime}
                </span>
              </div>
            </div>

            {/* LOCATION */}
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Location
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION */}
         <div className="mt-8">
         <Button
  onClick={acceptJob}
  disabled={loading || clicked}
  className="bg-[#0891b2] hover:bg-[#0e7490] text-white px-8 py-6 rounded-xl font-bold gap-2 text-base transition-all active:scale-95 shadow-lg shadow-cyan-100 cursor-pointer"
>
  <CheckCircle2 className="w-5 h-5" />
  {loading ? "Accepting..." : "Accept Job"}
</Button>

        </div>
      </div>

      {/* MAP SECTION */}
<div className="w-full md:w-80 relative overflow-hidden h-52 md:h-full min-h-[320px] bg-slate-100">
  {mapUrl ? (
    <img
      src={mapUrl}
      alt="Service"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      No Image
    </div>
  )}

  {/* <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2 shadow-sm">
    <MapPin className="w-3.5 h-3.5 text-[#0891b2]" />
    <span className="text-xs font-bold text-slate-700">{distance} away</span>
  </div> */}
</div>

    </motion.div>
  )
}
