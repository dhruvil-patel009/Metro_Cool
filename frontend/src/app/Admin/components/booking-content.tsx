"use client"

import { useState } from "react"
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

const bookings: Booking[] = [
  {
    id: "#BK-24-001",
    user: {
      name: "Alice Smith",
      avatar: "/thoughtful-man-portrait.png",
      type: "Regular Customer",
    },
    technician: {
      name: "John Doe",
      initials: "JD",
      color: "bg-blue-500",
    },
    service: "AC Repair - Standard",
    date: "Oct 24, 2023",
    time: "10:00 AM",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "#BK-24-002",
    user: {
      name: "Michael Ross",
      avatar: "/professional-man.png",
      type: "New User",
    },
    technician: {
      name: "Mike K.",
      initials: "MK",
      color: "bg-orange-500",
    },
    service: "Heater Checkup",
    date: "Oct 24, 2023",
    time: "02:00 PM",
    status: "Pending",
    payment: "Unpaid",
  },
  {
    id: "#BK-24-003",
    user: {
      name: "Sarah Jenkins",
      avatar: "/woman-portrait.png",
      type: "VIP Member",
    },
    technician: {
      name: "John Doe",
      initials: "JD",
      color: "bg-blue-500",
    },
    service: "Filter Replacement",
    date: "Oct 25, 2023",
    time: "09:00 AM",
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "#BK-24-004",
    user: {
      name: "David Chen",
      avatar: "/technician-male.jpg",
      type: "Commercial Client",
    },
    technician: {
      name: "Sam L.",
      initials: "SL",
      color: "bg-purple-500",
    },
    service: "Thermostat Install",
    date: "Oct 25, 2023",
    time: "11:30 AM",
    status: "In Progress",
    payment: "Paid",
  },
  {
    id: "#BK-24-005",
    user: {
      name: "Emma Wilson",
      avatar: "/technician-female.jpg",
      type: "Regular Customer",
    },
    technician: {
      name: "Mike K.",
      initials: "MK",
      color: "bg-orange-500",
    },
    service: "AC Full Install",
    date: "Oct 26, 2023",
    time: "08:00 AM",
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "#BK-24-006",
    user: {
      name: "Marcus Jones",
      avatar: "/thoughtful-man-portrait.png",
      type: "First Time",
    },
    technician: {
      name: "John Doe",
      initials: "JD",
      color: "bg-blue-500",
    },
    service: "Routine Maintenance",
    date: "Oct 26, 2023",
    time: "01:00 PM",
    status: "Confirmed",
    payment: "Unpaid",
  },
]

const statusColors = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
}

const paymentColors = {
  Paid: "text-green-600",
  Unpaid: "text-gray-500",
  Refunded: "text-red-600",
}

export function BookingsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("any")
  const [paymentFilter, setPaymentFilter] = useState("all")

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
            <p className="text-gray-600">Track appointments, manage technician schedules, and monitor payments.</p>
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="text-3xl font-bold text-gray-900">$12,450</div>
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
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 min-w-[180px]">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="bg-white">
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
                <SelectTrigger className="bg-white">
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
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Payment: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Payment: All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="bg-white">
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
              {bookings.map((booking) => (
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
                    <div className="text-xs text-gray-500">{booking.time}</div>
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
                        <DropdownMenuItem>Edit Booking</DropdownMenuItem>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{" "}
            <span className="font-medium">24</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-cyan-500 text-white hover:bg-cyan-600">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
