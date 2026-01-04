"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, User } from "lucide-react"
import { Button } from "@/app/components/ui/button"

type Job = {
  id: string
  time: string
  title: string
  location: string
  assignee: string
  borderColor: string
  isUrgent?: boolean
}

type DaySchedule = {
  date: number
  day: string
  jobs: Job[]
}

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState("October 2023")
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "list">("week")

  // Sample schedule data
  const weekSchedule: DaySchedule[] = [
    {
      date: 23,
      day: "MON",
      jobs: [
        {
          id: "1",
          time: "08:00 AM",
          title: "Annual Maintenance",
          location: "Lakeside Complex",
          assignee: "Sarah J.",
          borderColor: "border-green-500",
        },
        {
          id: "2",
          time: "01:30 PM",
          title: "Site Inspection",
          location: "TechFlow HQ",
          assignee: "Admin",
          borderColor: "border-orange-400",
        },
      ],
    },
    {
      date: 24,
      day: "TUE",
      jobs: [
        {
          id: "3",
          time: "09:30 AM",
          title: "AC Repair & Maint...",
          location: "Downtown Lofts, Apt 4B",
          assignee: "Sarah Jenkins",
          borderColor: "border-blue-500",
          isUrgent: true,
        },
        {
          id: "4",
          time: "02:00 PM",
          title: "Thermostat Install",
          location: "850 West Gardens",
          assignee: "Mike Ross",
          borderColor: "border-blue-500",
        },
      ],
    },
    {
      date: 25,
      day: "WED",
      jobs: [
        {
          id: "5",
          time: "11:00 AM",
          title: "Commercial Plumbing",
          location: "1200 Innovation Dr",
          assignee: "TechFlow Inc.",
          borderColor: "border-blue-500",
        },
      ],
    },
    {
      date: 26,
      day: "THU",
      jobs: [
        {
          id: "6",
          time: "10:00 AM",
          title: "Training Session",
          location: "Head Office",
          assignee: "",
          borderColor: "border-gray-300",
        },
        {
          id: "7",
          time: "03:00 PM",
          title: "Filter Replacement",
          location: "Westside Apts",
          assignee: "Manager",
          borderColor: "border-blue-500",
        },
      ],
    },
    {
      date: 27,
      day: "FRI",
      jobs: [
        {
          id: "8",
          time: "09:00 AM",
          title: "Final Inspection",
          location: "North Hills",
          assignee: "Mr. Smith",
          borderColor: "border-green-500",
        },
      ],
    },
    {
      date: 28,
      day: "SAT",
      jobs: [],
    },
    {
      date: 29,
      day: "SUN",
      jobs: [],
    },
  ]

  const handlePreviousMonth = () => {
    // Logic to navigate to previous month
    console.log("[v0] Navigate to previous month")
  }

  const handleNextMonth = () => {
    // Logic to navigate to next month
    console.log("[v0] Navigate to next month")
  }

  const handleNewJob = () => {
    console.log("[v0] Open new job modal")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold text-gray-900">My Schedule</h1>

          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviousMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <span className="min-w-[140px] text-center text-base font-medium text-gray-900">{currentMonth}</span>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode("day")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "day" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List
            </button>
          </div>

          {/* New Job Button */}
          <Button
            onClick={handleNewJob}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-4">
          {weekSchedule.map((day, index) => (
            <div key={day.date} className="flex flex-col">
              {/* Day Header */}
              <div className="mb-4 flex flex-col items-center">
                <span className="text-xs font-medium text-gray-500">{day.day}</span>
                <div
                  className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold ${
                    index === 1 ? "bg-blue-600 text-white" : "text-gray-900"
                  }`}
                >
                  {day.date}
                </div>
              </div>

              {/* Jobs for the Day */}
              <div className="flex flex-col gap-3">
                {day.jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`relative rounded-lg border-l-4 ${job.borderColor} bg-white p-3 shadow-sm hover:shadow-md transition-shadow`}
                  >
                    {/* Urgent Indicator */}
                    {job.isUrgent && <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />}

                    {/* Time Badge */}
                    <div
                      className={`mb-2 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        job.borderColor === "border-blue-500"
                          ? "bg-blue-100 text-blue-700"
                          : job.borderColor === "border-green-500"
                            ? "bg-green-50 text-green-700"
                            : job.borderColor === "border-orange-400"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {job.time}
                    </div>

                    {/* Job Title */}
                    <h3 className="mb-1 text-sm font-semibold text-gray-900">{job.title}</h3>

                    {/* Location */}
                    <p className="mb-2 text-xs text-gray-500">{job.location}</p>

                    {/* Assignee */}
                    {job.assignee && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{job.assignee}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
