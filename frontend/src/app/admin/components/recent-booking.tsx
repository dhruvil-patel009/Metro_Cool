"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"

const bookings = [
  { id: "#BK-001", userName: "John Doe", initials: "JD", service: "AC Repair", technician: "Mike T.", status: "In Progress", statusColor: "bg-blue-100 text-blue-700", payment: "Paid", paymentColor: "text-green-600" },
  { id: "#BK-002", userName: "Sarah Smith", initials: "SS", service: "Duct Cleaning", technician: "Unassigned", technicianColor: "text-gray-400 italic", status: "Pending", statusColor: "bg-orange-100 text-orange-700", payment: "Unpaid", paymentColor: "text-orange-600" },
  { id: "#BK-003", userName: "Robert Fox", initials: "RF", service: "Heating Install", technician: "Alex B.", status: "Completed", statusColor: "bg-green-100 text-green-700", payment: "Paid", paymentColor: "text-green-600" },
  { id: "#BK-004", userName: "Emily W.", initials: "EW", service: "Thermostat Check", technician: "Sarah J.", status: "Cancelled", statusColor: "bg-red-100 text-red-700", payment: "Refunded", paymentColor: "text-gray-600" },
  { id: "#BK-005", userName: "David K.", initials: "DK", service: "Gas Charging", technician: "Mike T.", status: "Completed", statusColor: "bg-green-100 text-green-700", payment: "Paid", paymentColor: "text-green-600" },
  { id: "#BK-006", userName: "Emma L.", initials: "EL", service: "AC Service", technician: "Alex B.", status: "Pending", statusColor: "bg-orange-100 text-orange-700", payment: "Unpaid", paymentColor: "text-orange-600" },
  { id: "#BK-007", userName: "Chris P.", initials: "CP", service: "Cooling Issue", technician: "Sarah J.", status: "In Progress", statusColor: "bg-blue-100 text-blue-700", payment: "Paid", paymentColor: "text-green-600" },
]

const ITEMS_PER_PAGE = 5

export function RecentBookingsTable() {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE)

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentBookings = bookings.slice(startIndex, endIndex)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
      </CardHeader>

      <CardContent className="sm:p-6 p-2 pt-0 space-y-4">
        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-xs font-semibold text-gray-500">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Technician</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Payment</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {currentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-4 font-medium">{b.id}</td>

                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{b.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{b.userName}</span>
                    </div>
                  </td>

                  <td className="py-4">{b.service}</td>
                  <td className={`py-4 text-sm ${b.technicianColor || ""}`}>{b.technician}</td>

                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${b.statusColor}`}>
                      {b.status}
                    </span>
                  </td>

                  <td className={`py-4 font-semibold ${b.paymentColor}`}>
                    {b.payment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE & TABLET CARDS ================= */}
        <div className="grid gap-4 lg:hidden">
          {currentBookings.map((b) => (
            <div key={b.id} className="rounded-xl border p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{b.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{b.userName}</p>
                  <p className="text-xs text-gray-500">{b.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Service</p>
                  <p className="font-medium">{b.service}</p>
                </div>

                <div>
                  <p className="text-gray-500">Technician</p>
                  <p className={`${b.technicianColor || ""}`}>{b.technician}</p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${b.statusColor}`}>
                    {b.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className={`font-semibold ${b.paymentColor}`}>{b.payment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, bookings.length)} of {bookings.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg border p-2 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg border p-2 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
