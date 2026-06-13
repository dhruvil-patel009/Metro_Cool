"use client"

import { useEffect, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import {
  Calendar,
  ClipboardList,
  CheckCircle2,
  Wallet,
  Search,
  Filter,
  IndianRupee,
  Download,
  MoreVertical,
  CalendarDays,
  Loader2,
} from "lucide-react"
import { AdminEmptyState } from "./admin-page-shell"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL


interface Booking {
  id: string
  user: {
    name: string
    avatar: string
    type: string
  }
  technician: {
    name: string
    initials: string
    color: string
  }
  service: string
  date: string
  time: string
  status: "Confirmed" | "Pending" | "Completed" | "In Progress" | "Cancelled"
  payment: "Paid" | "Unpaid" | "Refunded"
}

interface Stats {
  today: number
  pending: number
  completed: number
  revenue: number
}

/* ================= COLORS ================= */

const statusColors: Record<string, string> = {
  Open: "bg-blue-50 text-blue-700",
  Assigned: "bg-indigo-50 text-indigo-700",
  "On the Way": "bg-cyan-50 text-cyan-700",
  Working: "bg-purple-50 text-purple-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
}

const paymentColors: Record<string, string> = {
  Paid: "text-green-600",
  Unpaid: "text-gray-500",
  Refunded: "text-red-600",
}

export default function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  const [stats, setStats] = useState<Stats>({
    today: 0,
    pending: 0,
    completed: 0,
    revenue: 0,
  })

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 8
  const [total, setTotal] = useState(0)

  const [statusFilter, setStatusFilter] = useState("any")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const start = (page - 1) * limit + 1
const end = Math.min(page * limit, total)
const totalPages = Math.ceil(total / limit)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null

  /* ================= FETCH STATS ================= */

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/admin/bookings/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setStats(data)
  }

  /* ================= FETCH BOOKINGS ================= */

const fetchBookings = async () => {
  setLoading(true)

  try {
    const res = await fetch(
      `${API_URL}/admin/bookings?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) throw new Error("Failed to fetch bookings")

    const json = await res.json()
    setBookings(json.data ?? [])
    setTotal(json.total ?? 0)
  } catch (err) {
    console.error("Bookings fetch error:", err)
    setBookings([])
    setTotal(0)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    fetchStats()
    fetchBookings()
  }, [page])

  /* ================= FILTER ================= */

  const todayStr = new Date().toLocaleDateString("en-CA")

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase()

    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.user.name.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === "any" ||
      b.status.toLowerCase().replace(/[\s_-]/g, "") === statusFilter.toLowerCase().replace(/[\s_-]/g, "")

    const matchesPayment =
      paymentFilter === "all" ||
      b.payment.toLowerCase() === paymentFilter

    const bookingDate = String(b.date).slice(0, 10)
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && bookingDate === todayStr) ||
      (dateFilter === "week" && (() => {
        const d = new Date(bookingDate + "T00:00:00")
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      })()) ||
      (dateFilter === "month" && (() => {
        const d = new Date(bookingDate + "T00:00:00")
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })())

    return matchesSearch && matchesStatus && matchesPayment && matchesDate
  })


  // const totalPages = Math.max(1, Math.ceil(total / limit))

  const getPageNumbers = () => {
  const pages: number[] = []

  const maxButtons = 5
  let startPage = Math.max(1, page - 2)
  let endPage = Math.min(totalPages, startPage + maxButtons - 1)

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
}

  return (
    <div className="p-5 lg:p-7 max-w-[1600px] mx-auto space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track appointments, manage technician schedules, and monitor payments.</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Bookings", value: stats.today, icon: Calendar,     accent: "#3b82f6", light: "#eff6ff" },
          { label: "Pending",          value: stats.pending, icon: ClipboardList, accent: "#f97316", light: "#fff7ed" },
          { label: "Completed",        value: stats.completed, icon: CheckCircle2, accent: "#10b981", light: "#ecfdf5" },
          { label: "Total Revenue",    value: `₹${Number(stats.revenue).toLocaleString("en-IN")}`, icon: Wallet, accent: "#8b5cf6", light: "#f5f3ff" },
        ].map(({ label, value, icon: Icon, accent, light }) => (
          <div key={label} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-200 p-5">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: accent }} />
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-[0.08]" style={{ background: accent }} />
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: light }}>
                <Icon className="w-4.5 h-4.5" style={{ color: accent }} size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID, customer…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9 w-36 bg-gray-50 border-gray-200 text-gray-700 text-sm rounded-xl">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-36 bg-gray-50 border-gray-200 text-gray-700 text-sm rounded-xl">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="ontheway">On the Way</SelectItem>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="h-9 w-36 bg-gray-50 border-gray-200 text-gray-700 text-sm rounded-xl">
                <IndianRupee className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9 rounded-xl border-gray-200 text-gray-600">
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {["Booking ID", "Customer", "Technician", "Service", "Date", "Status", "Payment", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <AdminEmptyState title="No bookings found" description="Try adjusting your filters." />
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-mono text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md font-semibold">
                        #{String(booking.id).slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(booking.user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{booking.user.name}</p>
                          <p className="text-xs text-gray-400">{booking.user.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold">
                          {(booking.technician.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 whitespace-nowrap">{booking.technician.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{booking.service}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{booking.date}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusColors[booking.status] || "bg-gray-100 text-gray-700"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          booking.payment === "Paid" ? "bg-green-500"
                          : booking.payment === "Refunded" ? "bg-red-500"
                          : "bg-gray-300"
                        }`} />
                        <span className={`text-sm font-semibold ${paymentColors[booking.payment]}`}>{booking.payment}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/40">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{start}</span>–<span className="font-semibold text-gray-700">{end}</span> of <span className="font-semibold text-gray-700">{total}</span> bookings
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="rounded-xl" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            {getPageNumbers().map(p => (
              <Button
                key={p} variant="outline" size="sm"
                className={`rounded-xl w-9 ${ p === page ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" : "" }`}
                onClick={() => setPage(p)}
              >{p}</Button>
            ))}
            <Button variant="outline" size="sm" className="rounded-xl" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
        ) : filteredBookings.map((booking) => (
          <div key={booking.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(booking.user.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{booking.user.name}</p>
                  <p className="text-xs text-gray-400 font-mono">#{String(booking.id).slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${ statusColors[booking.status] || "bg-gray-100 text-gray-700" }`}>{booking.status}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-gray-400 text-xs">Service</p><p className="font-medium text-gray-800">{booking.service}</p></div>
              <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium text-gray-800">{booking.date}</p></div>
              <div><p className="text-gray-400 text-xs">Technician</p><p className="font-medium text-gray-800">{booking.technician.name || "—"}</p></div>
              <div>
                <p className="text-gray-400 text-xs">Payment</p>
                <p className={`font-semibold ${paymentColors[booking.payment]}`}>{booking.payment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
