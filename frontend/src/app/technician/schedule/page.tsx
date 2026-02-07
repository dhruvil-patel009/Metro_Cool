"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Printer,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Job = {
  id: string;
  time: string;
  title: string;
  type: string;
  customer: string;
  address: string;
  status: "scheduled" | "in-progress" | "pending";
  date: string;
  dayLabel?: string;
};

const upcomingJobs: Job[] = [
  {
    id: "1",
    time: "09:00 AM",
    title: "AC System Maintenance",
    type: "Maintenance",
    customer: "John Doe",
    address: "123 Maple Street",
    status: "in-progress",
    date: "2024-10-24",
    dayLabel: "TODAY",
  },
  {
    id: "2",
    time: "11:30 AM",
    title: "Heater Coil Repair",
    type: "Repair",
    customer: "Sarah Smith",
    address: "456 Oak Avenue",
    status: "pending",
    date: "2024-10-24",
    dayLabel: "TODAY",
  },
  {
    id: "3",
    time: "10:00 AM",
    title: "Thermostat Installation",
    type: "Installation",
    customer: "Robert Fox",
    address: "892 Pine Valley Dr",
    status: "scheduled",
    date: "2024-10-25",
    dayLabel: "TOMORROW",
  },
];

const calendarJobs = [
  { date: 13, title: "Inspection", color: "bg-emerald-500" },
  { date: 19, title: "AC Repair", color: "bg-teal-500" },
  {
    date: 24,
    jobs: [
      { time: "09:00", title: "AC Maint...", color: "bg-cyan-500" },
      { time: "11:30", title: "Heater...", color: "bg-yellow-500" },
      { time: "14:00", title: "Filter...", color: "bg-orange-500" },
    ],
  },
  {
    date: 25,
    jobs: [{ time: "10:00", title: "Install", color: "bg-blue-500" }],
  },
];

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(9); // October = 9
  const [currentYear, setCurrentYear] = useState(2022);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const previousMonthDays =
    firstDay > 0
      ? Array.from(
          { length: firstDay },
          (_, i) =>
            getDaysInMonth(currentMonth - 1, currentYear) - firstDay + i + 1,
        )
      : [];

  const getJobsForDate = (date: number) => {
    return calendarJobs.find((job) => job.date === date);
  };

  const filteredJobs = upcomingJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Schedule & Assignments
          </h1>
          <p className="text-slate-500 py-2 font-medium">
            Manage your upcoming jobs and appointments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 px-5 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 transition-all hover:scale-105 bg-transparent"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="bg-blue-600 hover:bg-[#0e7490] h-11 px-5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
            <Plus className="w-5 h-5 mr-2" />
            New Job
          </Button>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Calendar Header */}
          <Card className="p-6 border-slate-200 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-all hover:scale-110 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-2xl font-bold text-slate-900">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-all hover:scale-110 bg-transparent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                {(["month", "week", "day"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "px-4 py-1.5 rounded-md text-sm font-semibold transition-all capitalize",
                      view === v
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-bold text-slate-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Previous Month Days */}
                {previousMonthDays.map((day, idx) => (
                  <div
                    key={`prev-${idx}`}
                    className="aspect-square bg-slate-50/50 rounded-lg flex items-start justify-center pt-2 text-slate-300 text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}

                {/* Current Month Days */}
                {days.map((day) => {
                  const jobData = getJobsForDate(day);
                  const isToday = day === 24;

                  return (
                    <div
                      key={day}
                      className={cn(
                        "aspect-square rounded-lg flex flex-col items-start justify-start p-2 transition-all hover:shadow-md hover:scale-105 cursor-pointer group relative",
                        isToday
                          ? "bg-blue-600 text-white ring-2 ring-[#0891b2] ring-offset-2"
                          : "bg-white border border-slate-200 hover:border-[#0891b2]",
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-bold mb-1",
                          isToday
                            ? "text-white"
                            : "text-slate-900 group-hover:text-blue-500",
                        )}
                      >
                        {day}
                      </span>

                      {/* Single Event */}
                      {jobData && "title" in jobData && (
                        <div
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded text-white truncate w-full",
                            jobData.color,
                          )}
                        >
                          {jobData.title}
                        </div>
                      )}

                      {/* Multiple Events */}
                      {jobData && "jobs" in jobData && (
                        <div className="space-y-0.5 w-full">
                          {jobData && "jobs" in jobData && jobData.jobs && (
                            <div className="space-y-0.5 w-full">
                              {jobData.jobs.slice(0, 3).map((job, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "text-[8px] font-bold px-1 py-0.5 rounded text-white truncate",
                                    job.color,
                                  )}
                                >
                                  {job.time} - {job.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Today Badge */}
                      {isToday && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Today
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Filter Section */}
          <Card className="p-6 border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900">Filter Schedule</h3>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  className="pl-9 bg-slate-50 border-slate-200 rounded-lg h-10"
                  placeholder="Search by job ID or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg h-10">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg h-10">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Upcoming Jobs */}
          <Card className="p-6 border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-slate-900">Upcoming Jobs</h3>
              </div>
              <Button
                variant="link"
                className="text-blue-500 font-semibold text-sm p-0 h-auto hover:underline"
              >
                VIEW ALL
              </Button>
            </div>

            <div className="space-y-3">
              {filteredJobs.map((job, idx) => (
                <div
                  key={job.id}
                  className={cn(
                    "p-4 rounded-xl border-l-4 border-b-1 bg-gradient-to-r from-slate-50/50 to-transparent transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-500",
                    job.status === "in-progress" &&
                      "border-[#0891b2] hover:from-cyan-50/50",
                    job.status === "pending" &&
                      "border-yellow-400 hover:from-yellow-50/50",
                    job.status === "scheduled" &&
                      "border-blue-500 hover:from-blue-50/50",
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {job.dayLabel && (
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">
                      {job.dayLabel}
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg font-bold text-slate-900">
                      {job.time}
                    </span>
                    <Badge
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md",
                        job.status === "in-progress" &&
                          "bg-cyan-100 text-blue-500",
                        job.status === "pending" &&
                          "bg-yellow-100 text-yellow-700",
                        job.status === "scheduled" &&
                          "bg-blue-100 text-blue-700",
                      )}
                    >
                      {job.status === "in-progress"
                        ? "In Progress"
                        : job.status === "pending"
                          ? "Pending"
                          : "Scheduled"}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-3 group-hover:text-blue-500 transition-colors">
                    {job.title}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
