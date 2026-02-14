"use client";

import { Button } from "@/app/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { StatCards } from "./components/state-cards";
import { JobList } from "./components/job-list";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { fetchMyJobs } from "../lib/technician";

export default function Dashboard() {

  const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["technician-jobs"],
  queryFn: fetchMyJobs,
  refetchInterval: 30000,
});
const bookings = data?.bookings ?? [];
const serverTime = data?.serverTime ?? new Date().toISOString();



if (isLoading || !data) {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="text-slate-500 font-semibold animate-pulse">
        Fetching technician dashboard...
      </div>
    </div>
  );
}

if (isError) {
  return (
    <div className="h-[60vh] flex items-center justify-center text-red-500 font-semibold">
      Failed to load jobs. Please login again.
    </div>
  );
}


const serverDate = dayjs(serverTime);
  const today = serverDate.format("dddd, MMM D");

const todayJobs = bookings.filter((job: any) =>
  dayjs(job.booking_date || job.scheduled_date).isSame(serverDate, "day")
);


  const technicianName =
  data?.bookings?.[0]?.technician_name ||
  localStorage.getItem("tech_name") ||
  "Technician";

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {technicianName} 👋
          </h1>

          <div className="flex items-center py-4 gap-4 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{today}</span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <p className="text-sm">
              You have{" "}
              <span className="text-blue-500 font-bold">
                {todayJobs.length}
              </span>{" "}
              jobs today
            </p>
          </div>
        </div>

        {/* <Button className="bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button> */}
      </section>

<StatCards bookings={bookings} />

<JobList bookings={bookings} serverTime={serverTime} />
    </>
  );
}
