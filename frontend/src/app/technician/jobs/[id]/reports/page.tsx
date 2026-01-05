"use client"

import { Bell, Hammer, ClipboardList, PenTool, StickyNote, Camera, Plus, X, ChevronRight, Save } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ServiceCompletionReportPage({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState<string[]>(["/proof-of-work-1.jpg"])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0891b2] rounded-lg flex items-center justify-center">
              <Hammer className="w-4 h-4 text-white -rotate-12" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tight">TechMate Pro</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <span className="text-sm font-bold text-slate-400">Dashboard</span>
            <span className="text-sm font-bold text-[#0891b2]">Jobs</span>
            <span className="text-sm font-bold text-slate-400">Performance</span>
            <span className="text-sm font-bold text-slate-400">Settings</span>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="/technician-profile.png" alt="Profile" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Breadcrumbs & Title */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span>Active Jobs</span>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <span className="text-slate-900">Job #{params.id}-AC</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Service Completion Report</h1>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-cyan-50 rounded flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0891b2]" />
                </div>
                <span className="text-sm font-bold text-slate-500 tracking-wide">
                  Job #{params.id}-AC - HVAC Repair
                </span>
              </div>
            </div>
            <div className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full border border-orange-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">In Progress</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Progress Indicator */}
          <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
              <span className="text-[#0891b2]">Step 3 of 4: Report Details</span>
              <span className="text-slate-400">Next: Verification</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-cyan-400 rounded-full"
              />
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Issue Description */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                <ClipboardList className="w-5 h-5 text-[#0891b2]" />
                Issue Description
              </label>
              <textarea
                placeholder="Describe the diagnosed problem in detail..."
                className="w-full h-32 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Fix Applied */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                <PenTool className="w-5 h-5 text-[#0891b2]" />
                Fix Applied
              </label>
              <textarea
                placeholder="List parts replaced and repairs performed..."
                className="w-full h-32 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                  <StickyNote className="w-5 h-5 text-[#0891b2]" />
                  Additional Notes
                </label>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">(Optional)</span>
              </div>
              <textarea
                placeholder="Any warnings, follow-up recommendations, or customer comments..."
                className="w-full h-24 p-6 rounded-2xl bg-white border border-slate-200 focus:border-[#0891b2] focus:ring-4 focus:ring-cyan-50 transition-all outline-none text-slate-600 font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Proof of Work */}
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-slate-900 font-bold tracking-tight">
                <Camera className="w-5 h-5 text-[#0891b2]" />
                Proof of Work
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-[#0891b2] hover:text-[#0891b2] transition-all bg-slate-50/50 group">
                  <Plus className="w-6 h-6 transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
                </button>
                {photos.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-2xl overflow-hidden relative group border border-slate-100 shadow-sm"
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      alt="Proof"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              className="px-8 h-14 rounded-xl border-slate-200 font-bold text-slate-600 bg-white gap-2"
            >
              <Save className="w-5 h-5" />
              Save Draft
            </Button>
            <Button className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-white h-14 rounded-xl font-black text-lg gap-2 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]">
              Proceed to OTP Verification
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Page Footer */}
        <footer className="text-center py-4">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            © 2026 TechMate Pro Services. Job ID: {params.id}-AC
          </p>
        </footer>
      </main>
    </div>
  )
}
