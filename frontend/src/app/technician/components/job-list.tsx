"use client";


import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { JobCard } from "./job-card";
import { Input } from "@/app/components/ui/input";
import { ArrowRight, CalendarIcon, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import Link from "next/link";
export function JobList({ bookings, serverTime }: any) {

    const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in-progress" | "scheduled" | "pending"
  >("all");
  const serverDate = dayjs(serverTime);

  const jobsToShow = useMemo(() => {
    const todayJobs = bookings.filter((job: any) =>
      dayjs(job.scheduled_date).isSame(serverDate, "day")
    );

    if (todayJobs.length > 0) return todayJobs;

    // If no today jobs → show latest
    return bookings
      .sort(
        (a: any, b: any) =>
          dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
      )
      .slice(0, 5);
  }, [bookings, serverTime]);

  return (
    <div className="space-y-4 mt-6">
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            className="pl-12 bg-white border-slate-200 h-12 text-sm focus-visible:ring-1 focus-visible:ring-[#0891b2] focus-visible:border-[#0891b2]"
            placeholder="Search jobs, customers, or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            size="icon"
            className="absolute right-1.5 top-1.5 h-9 w-9 bg-blue-600 hover:bg-[#0e7490]"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-6 font-bold border-slate-200 text-slate-700 min-w-[140px] justify-between bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {statusFilter === "all"
                ? "All Jobs"
                : statusFilter.replace("-", " ")}
              <ArrowRight className="w-4 h-4 ml-2 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All Jobs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>
              Scheduled
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          Today's Schedule
        </h3>
        <Link href="/technician/jobs" className="text-sm text-blue-500 font-bold flex items-center gap-1">
        <Button variant="link" className="text-blue-500 font-bold text-sm cursor-pointer">
          View Full Schedule
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
        </Link>
      </div>
{jobsToShow
  .filter((job: any) => job.job_status === "open")
  .map((job: any) => (
    <JobCard key={job.id} job={job} />
  ))}

  

    </div>
  );
}
