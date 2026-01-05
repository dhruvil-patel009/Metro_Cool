"use client"

import {
  ArrowLeft,
  Bell,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Navigation,
  ExternalLink,
  History,
  Edit2,
  Car,
  User,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { WorkingView } from "../../components/working-view"

export default function JobDetailsPage() {
  const [isWorking, setIsWorking] = useState(false) // added state to toggle between details and working view

  if (isWorking) {
    return <WorkingView onBack={() => setIsWorking(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-slate-900">Job #8492</h1>
              <span className="text-sm font-medium text-slate-400">Technician Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Scheduled</span>
            </div>
            <Button variant="ghost" size="icon" className="relative text-slate-400">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#0891b2] font-bold text-xs uppercase tracking-widest">
              <div className="w-4 h-4 rounded-sm border-2 border-[#0891b2] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0891b2]" />
              </div>
              HVAC Maintenance
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Standard System Tune-up</h2>
            <div className="flex items-center gap-6 text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Springfield, IL
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Today, 2pm - 4pm
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsWorking(true)} // added click handler to transition to working view
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-10 py-10 rounded-[2rem] font-black text-2xl gap-6 shadow-xl shadow-blue-100 transition-all active:scale-95 group"
          >
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] mb-2 opacity-80">Next Step</span>
              <span>ON THE WAY</span>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Car className="w-8 h-8" />
            </div>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Customer Information</h3>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</span>
                  <h4 className="text-2xl font-extrabold text-slate-900">Sarah Jenkins</h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    Verified Customer
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-emerald-100 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50 font-bold gap-2 px-6 py-6 rounded-xl"
                >
                  <Phone className="w-5 h-5" />
                  Call Customer
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Service Location
                    </span>
                    <p className="text-lg font-bold text-slate-700">742 Evergreen Terrace</p>
                    <p className="text-sm font-medium text-slate-400">Springfield, IL 62704</p>
                  </div>
                </div>

                <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 h-64 shadow-inner">
                  <img
                    src="/job-map-detail.jpg"
                    alt="Service Map"
                    className="w-full h-full object-cover grayscale-[0.2]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center animate-ping" />
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-xl absolute" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-14 rounded-xl border-slate-200 font-bold gap-2 bg-transparent">
                    <ExternalLink className="w-5 h-5" />
                    Google Maps
                  </Button>
                  <Button className="h-14 rounded-xl bg-[#0f172a] hover:bg-black text-white font-bold gap-2">
                    <Navigation className="w-5 h-5 rotate-45" />
                    Start Navigation
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Service Details</h3>
            </div>

            <div className="p-8 space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50/80 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Date
                    </span>
                    <p className="font-bold text-slate-900">Today, Oct 24</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/80 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Arrival Window
                    </span>
                    <p className="font-bold text-slate-900">02:00 PM - 04:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Notes</span>
                </div>
                <div className="p-8 bg-yellow-50/50 border-l-4 border-yellow-400 rounded-r-2xl text-slate-700 italic font-medium leading-relaxed relative">
                  "Gate code is{" "}
                  <span className="bg-white px-2 py-0.5 rounded border border-yellow-100 not-italic font-black text-slate-900">
                    #1920
                  </span>
                  . Please watch out for the dog in the backyard, he is friendly but will jump. Call when 5 mins away."
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0891b2]/10 transition-colors">
                  <History className="w-5 h-5 text-slate-400 group-hover:text-[#0891b2]" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900">View History</span>
              </button>
              <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0891b2]/10 transition-colors">
                  <Edit2 className="w-5 h-5 text-slate-400 group-hover:text-[#0891b2]" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900">Edit Job</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
