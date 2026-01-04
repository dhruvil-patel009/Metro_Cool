"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { MapPin, Calendar, Clock, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

const jobs = [
  {
    id: 1,
    status: "new",
    statusLabel: "New Request",
    title: "AC Repair & Maintenance",
    customer: "Sarah Jenkins",
    customerAvatar: "SJ",
    location: "Downtown Lofts, Apt 4B",
    time: "Today, 2:00 PM - 4:00 PM",
    timeAgo: "15 min ago",
    image: "/floor-plan-blueprint.png",
  },
  {
    id: 2,
    status: "new",
    statusLabel: "New Request",
    title: "Commercial Plumbing Check",
    customer: "TechFlow Inc.",
    customerAvatar: "TF",
    location: "1200 Innovation Drive, Floor 3",
    time: "Tomorrow, 9:00 AM",
    timeAgo: "45 min ago",
    image: "/office-building-technology.jpg",
  },
  {
    id: 3,
    status: "pending",
    statusLabel: "Pending Approval",
    title: "Smart Thermostat Install",
    customer: "Mike Ross",
    customerAvatar: "MR",
    location: "850 West Gardens",
    time: "Thu, Oct 12, 10:30 AM",
    timeAgo: "2 hrs ago",
    image: "/smart-thermostat-device.jpg",
  },
]

const tabs = [
  { id: "new", label: "New Jobs", count: 3 },
  { id: "accepted", label: "Accepted Jobs", count: 5 },
  { id: "completed", label: "Completed Jobs", count: 0 },
]

export function JobsList() {
  const [activeTab, setActiveTab] = useState("new")

  return (
    <div>
      <div className="mb-6 flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {tab.count}
              </Badge>
            )}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job.id} className="overflow-hidden border-border">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[1fr_200px]">
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge
                      variant="secondary"
                      className={
                        job.status === "new"
                          ? "bg-blue-50 text-primary hover:bg-blue-100"
                          : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      }
                    >
                      {job.statusLabel}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {job.timeAgo}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-foreground">{job.title}</h3>

                  <div className="mb-4 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback className="bg-muted text-xs">{job.customerAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">{job.customer}</span>
                  </div>

                  <div className="mb-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>

                  <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{job.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Accept Job</DropdownMenuItem>
                        <DropdownMenuItem>Decline</DropdownMenuItem>
                        <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="relative hidden bg-muted md:block">
                  <img src={job.image || "/placeholder.svg"} alt={job.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
