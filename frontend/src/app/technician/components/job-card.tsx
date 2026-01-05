import { User, MapPin, Clock, ChevronRight, Play } from "lucide-react"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/app/lib/utils"

export type JobStatus = "in-progress" | "scheduled" | "pending"

export interface Job {
  id: string
  title: string
  customer: string
  address: string
  time: string
  status: JobStatus
  image: string
}

export function JobCard({ job }: { job: Job }) {
  const statusStyles = {
    "in-progress": "bg-cyan-50 text-cyan-700 border-cyan-100",
    scheduled: "bg-amber-50 text-amber-700 border-amber-100",
    pending: "bg-slate-100 text-slate-600 border-slate-200",
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <CardContent className="p-0 flex flex-col md:flex-row">
        <div className="w-full md:w-48 h-40 relative overflow-hidden shrink-0">
          <img
            src={job.image || "/placeholder.svg"}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {job.status === "in-progress" && (
            <div className="absolute top-2 right-2 bg-cyan-600 p-1.5 rounded-full shadow-lg">
              <Play className="w-3 h-3 text-white fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={cn("uppercase text-[10px] font-bold px-2 py-0.5 tracking-wider", statusStyles[job.status])}
              >
                {job.status.replace("-", " ")}
              </Badge>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">{job.time}</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0891b2] transition-colors">
                {job.title}
              </h4>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{job.customer}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs">{job.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant={job.status === "in-progress" ? "default" : "outline"}
              className={cn(
                "rounded-lg font-bold text-xs uppercase tracking-wider px-6 h-10 group-hover:gap-3 transition-all",
                job.status === "in-progress" ? "bg-[#0891b2] hover:bg-[#0e7490]" : "text-slate-600 border-slate-200",
              )}
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
