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
  DollarSign,
  Download,
  MoreVertical,
  CalendarDays,
  Plus,
} from "lucide-react"

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
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
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
  const limit = 4
  const [total, setTotal] = useState(0)

  const [search, setSearch] = useState("")
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

const filteredBookings = bookings.filter((b) => {
  const q = searchQuery.toLowerCase()

  const matchesSearch =
    b.id.toLowerCase().includes(q) ||
    b.user.name.toLowerCase().includes(q)

  const matchesStatus =
    statusFilter === "any" ||
    b.status.toLowerCase() === statusFilter

  const matchesPayment =
    paymentFilter === "all" ||
    b.payment.toLowerCase() === paymentFilter

  return matchesSearch && matchesStatus && matchesPayment
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
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
            <p className="text-gray-600">Track appointments, manage technician schedules, and monitor payments.</p>
          </div>
          {/* <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Booking
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 py-6 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Today's Bookings</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">24</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Pending Approval</span>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">7</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Completed</span>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">128</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Total Revenue</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">₹12,450</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID, User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
    pl-10
    bg-white
    text-gray-900
    border border-gray-200
    focus:border-blue-500
    focus:ring-0
    focus:outline-none
  "
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 min-w-[180px]">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-white text-black
  border border-gray-200
  focus:border-blue-500
  focus:ring-0">
                  <SelectValue placeholder="Date: All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Date: All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[160px]">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white text-black
  border border-gray-200
  focus:border-blue-500
  focus:ring-0 ">
                  <SelectValue placeholder="Status: Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Status: Any</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[160px]">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="bg-white text-black
  border border-gray-200
  focus:border-blue-500
  focus:ring-0">
                  <SelectValue placeholder="Payment: All" />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all">Payment: All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="bg-white text-black">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">{booking.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                     <img
  src={booking.user.avatar || "/placeholder.svg"}
  alt={booking.user.name}
  className="w-10 h-10 rounded-full object-cover"
/>
                      <div>
                        <div className="font-medium text-gray-900">{booking.user.name}</div>
                        <div className="text-sm text-gray-500">{booking.user.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 ${booking.technician.color} rounded-md flex items-center justify-center text-white text-xs font-medium`}
                      >
                        {booking.technician.initials}
                      </div>
                      <span className="text-sm text-gray-700">{booking.technician.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{booking.service}</td>
                  <td className="p-4">
                    <div className="text-sm text-gray-700">{booking.date}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          booking.payment === "Paid"
                            ? "bg-green-600"
                            : booking.payment === "Refunded"
                              ? "bg-red-600"
                              : "bg-gray-400"
                        }`}
                      />
                      <span className={`text-sm font-medium ${paymentColors[booking.payment]}`}>{booking.payment}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        {/* <DropdownMenuItem>Edit Booking</DropdownMenuItem> */}
                        <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancel Booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
<div className="flex items-center justify-between p-4 border-t border-gray-200">
  <div className="text-sm text-gray-600">
    Showing <span className="font-medium">{start}</span> to{" "}
    <span className="font-medium">{end}</span> of{" "}
    <span className="font-medium">{total}</span> results
  </div>

  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      disabled={page === 1}
      onClick={() => setPage((p) => Math.max(1, p - 1))}
    >
      Previous
    </Button>

    {getPageNumbers().map((p) => (
      <Button
        key={p}
        variant="outline"
        size="sm"
        onClick={() => setPage(p)}
        className={
          p === page
            ? "bg-blue-500 text-white"
            : "bg-white text-gray-700"
        }
      >
        {p}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      disabled={page === totalPages}
      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    >
      Next
    </Button>
  </div>
</div>


      </div>
    </div>
  )
}
