"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/app/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-blue-50 text-blue-700",
  Assigned: "bg-indigo-50 text-indigo-700",
  "On the Way": "bg-cyan-50 text-cyan-700",
  Working: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
  Confirmed: "bg-gray-100 text-gray-700",
}

export function RecentBookingsTable() {
  const [bookings, setBookings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const LIMIT = 6
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const fetchBookings = async (p: number) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/admin/bookings?page=${p}&limit=${LIMIT}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBookings(data.data || [])
      setTotal(data.total || 0)
    } catch {
      // silently fail — dashboard shouldn't crash if bookings fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings(page) }, [page])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-gray-900">Recent Bookings</CardTitle>
        <button
          onClick={() => fetchBookings(page)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="p-0 pt-0">

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium">No bookings yet</p>
          </div>
        )}

        {/* ── Desktop Table ── */}
        {!loading && bookings.length > 0 && (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-gray-50/70">
                    {["Booking ID", "Customer", "Service", "Date", "Status", "Payment"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-mono text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                          #{String(b.id).slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(b.user?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {b.user?.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{b.service || "—"}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                        {b.date
                          ? new Date(b.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                          : "—"}
                        {b.time && <span className="text-gray-400 ml-1 text-xs">{b.time}</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold text-sm ${b.payment === "Paid" ? "text-green-600" : "text-amber-500"}`}>
                          {b.payment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="lg:hidden divide-y divide-gray-50">
              {bookings.map(b => (
                <div key={b.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(b.user?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{b.user?.name || "—"}</p>
                        <p className="text-xs text-gray-400 font-mono">#{String(b.id).slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-600"}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Service</p>
                      <p className="font-medium text-gray-700">{b.service || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Date</p>
                      <p className="font-medium text-gray-700">
                        {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Payment</p>
                      <p className={`font-semibold ${b.payment === "Paid" ? "text-green-600" : "text-amber-500"}`}>
                        {b.payment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <p className="text-sm text-gray-500">
                {total} booking{total !== 1 ? "s" : ""} total
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline" size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
