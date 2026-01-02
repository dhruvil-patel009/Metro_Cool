import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { MoreVertical, ChevronLeft } from "lucide-react"

const bookings = [
  {
    id: "#BK-001",
    userName: "John Doe",
    initials: "JD",
    service: "AC Repair",
    technician: "Mike T.",
    status: "In Progress",
    statusColor: "bg-cyan-100 text-cyan-700",
    payment: "Paid",
    paymentColor: "text-green-600",
  }, 
  {
    id: "#BK-002",
    userName: "Sarah Smith",
    initials: "SS",
    service: "Duct Cleaning",
    technician: "Unassigned",
    technicianColor: "text-gray-400 italic",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-700",
    payment: "Unpaid",
    paymentColor: "text-orange-600",
  },
  {
    id: "#BK-003",
    userName: "Robert Fox",
    initials: "RF",
    service: "Heating Install",
    technician: "Alex B.",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    payment: "Paid",
    paymentColor: "text-green-600",
  },
  {
    id: "#BK-004",
    userName: "Emily W.",
    initials: "EW",
    service: "Thermostat Check",
    technician: "Sarah J.",
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-700",
    payment: "Refunded",
    paymentColor: "text-gray-600",
  },
]

export function RecentBookingsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">View All</button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Booking ID
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  User Name
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Service</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Technicians
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Payment</th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200 text-xs text-gray-700">
                          {booking.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{booking.userName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{booking.service}</td>
                  <td className={`py-4 text-sm ${booking.technicianColor || "text-gray-900"}`}>{booking.technician}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className={`py-4 text-sm font-semibold ${booking.paymentColor}`}>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {booking.payment}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="rounded-lg p-1.5 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">Showing 1-4 of 1240 results</p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
