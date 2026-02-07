"use client";

import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  ImageIcon,
  FileText,
  CheckCircle2,
  Plus,
  Headphones,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { JobStepper } from "./job-stepper";
import { ServiceChecklist } from "./service-checklist";
import Link from "next/link";

export function WorkingView({
  onBack,
  jobId = "1234",
}: {
  onBack: () => void;
  jobId?: string;
}) {
  const [time, setTime] = useState("00:45:12");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Header/Navigation - Custom for context */}
      <header className="bg-white border-b border-slate-100 px-8 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-1 bg-white rounded-full rotate-[-45deg] translate-y-[2px]" />
                <div className="w-4 h-4 bg-white rounded-sm scale-75 -translate-x-[2px]" />
              </div>
              <span className="font-black text-slate-900 text-xl tracking-tight">
                TechDash
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <span className="text-sm font-bold text-slate-400">Dashboard</span>
            <span className="text-sm font-bold text-blue-500 border-b-2 border-[#0891b2] pb-1">
              Schedule
            </span>
            <span className="text-sm font-bold text-slate-400">History</span>
            <span className="text-sm font-bold text-slate-400">Profile</span>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-full gap-2 font-bold text-slate-600 border-slate-200 bg-transparent"
            >
              <Headphones className="w-4 h-4" />
              Support
            </Button>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="/technician-profile.png" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Breadcrumb & Title Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Dashboard</span>
              <span className="opacity-30">/</span>
              <span>Schedule</span>
              <span className="opacity-30">/</span>
              <span className="text-slate-900">Job #1234</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                  Active Job
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Updated 2m ago
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                AC Repair: Unit Failure
              </h1>
              <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <MapPin className="w-5 h-5" />
                123 Main St, Springfield, IL
              </div>
            </div>
          </div>

          {/* Time on Site Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 min-w-[280px]">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Time On Site
              </span>
              <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                {time}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Stepper */}
        <div className="bg-white rounded-[2.5rem] p-8 md:px-12 border border-slate-100 shadow-sm">
          <JobStepper currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Current Step Actions
                </h3>
                <p className="text-slate-400 font-medium">
                  Ensure all safety checks are completed before finishing the
                  job.
                </p>
              </div>

              <Link href={`/technician/jobs/${jobId}/reports`}>
                <Button className="w-full bg-blue-600 hover:bg-[#0e7490] text-white py-8 rounded-2xl font-black text-xl gap-3 shadow-lg shadow-cyan-100 transition-all active:scale-[0.98]">
                  <CheckCircle2 className="w-6 h-6" />
                  MARK JOB AS COMPLETED
                </Button>
              </Link>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Phone, label: "Call Client" },
                  { icon: Navigation, label: "Navigate" },
                  { icon: ImageIcon, label: "Upload Photo" },
                  { icon: FileText, label: "Add Notes" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group"
                  >
                    <action.icon className="w-6 h-6 text-slate-400 group-hover:text-slate-900" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Checklist */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <ServiceChecklist />
            </div>
          </div>

          {/* Right Sidebar Info */}
          <div className="space-y-8">
            {/* Customer Info Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Info
                </h3>
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Name
                  </span>
                  <p className="font-bold text-slate-900">Sarah Jenkins</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Contact
                  </span>
                  <p className="font-bold text-blue-500">(555) 123-4567</p>
                  <p className="text-sm font-medium text-slate-400">
                    sarah.j@example.com
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Customer Since
                  </span>
                  <p className="font-bold text-slate-700">March 2021</p>
                </div>
              </div>
            </div>

            {/* Location Map Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Location</h3>
                <button className="text-xs font-bold text-blue-500 hover:underline">
                  Open in Maps
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src="/working-location-map.jpg"
                    alt="Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-lg relative z-10" />
                    <div className="w-12 h-12 rounded-full bg-blue-600/30 animate-ping absolute" />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    Gate Code:
                  </span>
                  <span className="bg-cyan-50 text-blue-500 px-3 py-1 rounded-full font-black text-sm border border-cyan-100">
                    #4589
                  </span>
                </div>
              </div>
            </div>

            {/* Technician Notes Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-900">
                  Technician Notes
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-4">
                  "Customer reported loud banging noise when unit starts up.
                  Suspect fan blade issue or loose mount."
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded-xl overflow-hidden border border-slate-100">
                    <img
                      src="/unit-photo-1.jpg"
                      alt="Notes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="aspect-square rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center hover:border-slate-300 transition-colors">
                    <Plus className="w-6 h-6 text-slate-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
