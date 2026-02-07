"use client";

import { cn } from "@/app/lib/utils";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { JobCard, type Job } from "./job-card";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "AC System Maintenance",
    customer: "John Doe",
    address: "123 Maple Street, Downtown",
    time: "09:00 AM - 11:00 AM",
    status: "in-progress",
    image: "/ac-unit-maintenance.jpg",
  },
  {
    id: "2",
    title: "Heater Coil Repair",
    customer: "Sarah Smith",
    address: "456 Oak Avenue, Westside",
    time: "11:30 AM - 01:00 PM",
    status: "scheduled",
    image: "/heater-repair.jpg",
  },
  {
    id: "3",
    title: "HEPA Filter Replacement",
    customer: "Mike Ross",
    address: "789 Pine Lane, Suburbs",
    time: "02:00 PM - 02:45 PM",
    status: "pending",
    image: "/filter-replacement.png",
  },
];

export function JobList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in-progress" | "scheduled" | "pending"
  >("all");

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
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
        <Button variant="link" className="text-blue-500 font-bold text-sm">
          View Full Schedule
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="py-20 text-center bg-white rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">
              No jobs found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <div className={cn("bg-cyan-50 rounded", className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    </div>
  );
}
