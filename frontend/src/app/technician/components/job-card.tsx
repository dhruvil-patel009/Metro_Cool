import { User, MapPin, Clock, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";
import Link from "next/link";

/* ----------- TYPES ----------- */

export type Address = {
  apt?: string;
  street?: string;
  city?: string;
  zipCode?: string;
};

export interface Job {
  full_name: string;
  services: any;
  issues: any;
  id: string;
  booking_date: string;
  time_slot: string;
  status: string;
  customer_name?: string;
  service_name?: string;
  address: Address | string | null;
}

/* ----------- COMPONENT ----------- */

export function JobCard({ job }: { job: Job }) {

  // 🧠 Convert address safely (handles object OR string OR null)
  let addressObj: Address | null = null;

  try {
    if (!job.address) addressObj = null;
    else if (typeof job.address === "string") {
      addressObj = JSON.parse(job.address);
    } else {
      addressObj = job.address;
    }
  } catch {
    addressObj = null;
  }

  const formattedAddress = addressObj
    ? `${addressObj.apt ? "Apt " + addressObj.apt + ", " : ""}${addressObj.street ?? ""}, ${addressObj.city ?? ""} ${addressObj.zipCode ?? ""}`
    : "Address not available";

  /* status color */
  const statusStyles: Record<string, string> = {
    assigned: "bg-amber-50 text-amber-700 border-amber-100",
    on_the_way: "bg-blue-50 text-blue-700 border-blue-100",
    working: "bg-cyan-50 text-cyan-700 border-cyan-100",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  const serviceImage =
    Array.isArray(job.services)
      ? job.services[0]?.image_url
      : job.services?.image_url;


  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <CardContent className="p-0 flex flex-col md:flex-row">

        {/* LEFT IMAGE */}
        <div className="w-full md:w-48 h-40 relative overflow-hidden shrink-0">
          <img
            src={serviceImage || "/placeholder.svg"}
            alt="service"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />


          {job.status === "working" && (
            <div className="absolute top-2 right-2 bg-cyan-600 p-1.5 rounded-full shadow-lg">
              <Play className="w-3 h-3 text-white fill-current" />
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">

            {/* STATUS + TIME */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "uppercase text-[10px] font-bold px-2 py-0.5 tracking-wider",
                  statusStyles[job.status] || "bg-slate-100 text-slate-600"
                )}
              >
                {job.status.replaceAll("_", " ")}
              </Badge>

              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  {job.booking_date}
                </span>
              </div>
            </div>

            {/* SERVICE INFO */}
            <div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-500 transition-colors">
                {job.services?.title || job.issues?.join(", ") || "Service Job"}
              </h4>

              <div className="mt-2 space-y-1.5">

                {/* CUSTOMER */}
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {job.full_name || "Customer"}
                  </span>
                </div>

                {/* ADDRESS (FIXED) */}
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs">{formattedAddress}</span>
                </div>

              </div>
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-center">
            <Link href={`/technician/jobs/${job.id}`} className="ml-auto">
              <Button
                variant="outline"
                className="rounded-lg font-bold text-xs uppercase tracking-wider px-6 h-10 cursor-pointer group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
