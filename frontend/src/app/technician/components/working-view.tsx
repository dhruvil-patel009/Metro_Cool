"use client";

import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  ImageIcon,
  FileText,
  CheckCircle2,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobStepper } from "./job-stepper";
import { ServiceChecklist } from "./service-checklist";
import Link from "next/link";

/* ---------------- TYPES ---------------- */

type Address = {
  street?: string;
  apt?: string;
  city?: string;
  zipCode?: string;
};

type Booking = {
  id: string;
  booking_date: string;
  time_slot: string;
  job_status: "open" | "assigned" | "on_the_way" | "working" | "completed"
  issues?: string[];
  instructions?: string;
  address: Address | string | null;
  user: {
    full_name: string;
    phone: string;
  };
};

/* ---------------- COMPONENT ---------------- */

export function WorkingView({
  onBack,
  jobId,
}: {
  onBack: () => void;
  jobId: string;
}) {
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [completing, setCompleting] = useState(false);

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  /* ---------------- FETCH BOOKING ---------------- */

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/techjobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const json = await res.json();

        if (json.success) {
          setBooking(json.booking);

          // if job already completed redirect to jobs list
          if (json.booking.job_status === "completed") {
            router.push("/technician/jobs");
          }
        }
      } catch (err) {
        console.error("Failed to load job", err);
      }
    };

    if (jobId) fetchBooking();
  }, [jobId, router]);

  /* ---------------- ADDRESS PARSER ---------------- */

  const parseAddress = (address: any): Address | null => {
    if (!address) return null;

    if (typeof address === "string") {
      try {
        return JSON.parse(address);
      } catch {
        return null;
      }
    }

    return address;
  };

  const address = parseAddress(booking?.address);

  const fullAddress = address
    ? [address.street, address.city, address.zipCode]
      .filter(Boolean)
      .join(", ")
    : "";

  if (!booking)
    return <div className="p-10 text-center">Loading job...</div>;



  const completeJob = async () => {
    if (completing) return;

    try {
      setCompleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tech-jobs/${jobId}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Failed to complete job");
        setCompleting(false);
        return;
      }

      // redirect back to jobs page
      router.push(`/technician/jobs/${jobId}/reports`);

    } catch (err) {
      console.error(err);
      alert("Server error");
      setCompleting(false);
    }
  };


  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <main className="max-w-7xl mx-auto p-8 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Dashboard</span>
              <span className="opacity-30">/</span>
              <span>Schedule</span>
              <span className="opacity-30">/</span>
              <span className="text-slate-900">Job #{booking.id}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600/10 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                  Active Job
                </span>
                <span className="text-xs font-bold text-slate-400">Live</span>
              </div>

              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {booking.issues?.join(", ") || "Service Job"}
              </h1>

              <div className="flex items-center gap-2 text-slate-400 font-semibold">
                <MapPin className="w-5 h-5" />
                {fullAddress || "Address unavailable"}
              </div>
            </div>
          </div>

          {/* TIMER */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 min-w-[280px]">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                Time On Site
              </span>
              <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
                {formatTime()}
              </p>
            </div>
          </div>
        </div>

        {/* STEPPER */}
        <div className="bg-white rounded-[2.5rem] p-8 md:px-12 border border-slate-100 shadow-sm">
          <JobStepper currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* ACTION CARD */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Current Step Actions
                </h3>
                <p className="text-slate-400 font-medium">
                  Ensure all safety checks are completed before finishing the job.
                </p>
              </div>

              {/* COMPLETE BUTTON */}
              <Link href={`/technician/jobs/${jobId}/reports`}>
                <Button
                  onClick={completeJob}
                  disabled={completing}
                  className="w-full bg-blue-600 text-white py-8 rounded-2xl font-black text-xl gap-3 hover:bg-blue-700"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  {completing ? "Completing..." : "MARK JOB AS COMPLETED"}
                </Button>
              </Link>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* CALL */}
                <button
                  onClick={() => {
                    if (!booking.user.phone) return;
                    window.location.href = `tel:${booking.user.phone}`;
                  }}
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100"
                >
                  <Phone className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    Call Client
                  </span>
                </button>

                {/* NAVIGATE */}
                <button
                  onClick={() =>
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const { latitude, longitude } = pos.coords;
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(fullAddress)}`
                      );
                    })
                  }
                  className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100"
                >
                  <Navigation className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    Navigate
                  </span>
                </button>

                <div className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    Upload Photo
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <FileText className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500">
                    Add Notes
                  </span>
                </div>
              </div>
            </div>

            {/* CHECKLIST */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <ServiceChecklist />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">

            {/* CUSTOMER */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Info
                </h3>
                <User className="w-5 h-5 text-slate-300" />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Name
                  </span>
                  <p className="font-bold text-slate-900">
                    {booking.user.full_name}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Contact
                  </span>
                  <p className="font-bold text-blue-500">
                    {booking.user.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* MAP */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Location</h3>
              </div>

              {fullAddress ? (
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
                  className="w-full h-64 border-0"
                  loading="lazy"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  Address not available
                </div>
              )}
            </div>

            {/* INSTRUCTIONS */}
            {booking.instructions && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl break-words">
                <p className="italic text-slate-700 whitespace-pre-wrap">
                  {booking.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
