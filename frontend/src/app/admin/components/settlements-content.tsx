"use client"

import { useState } from "react"
import { Calendar, Download, Filter, FileText, CheckCircle2, DollarSign, Percent, Clock, Mail } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { toast } from "react-toastify"

interface Settlement {
  id: string
  technician: {
    name: string
    techId: string
    avatar: string
  }
  bookingId: string
  service: {
    name: string
    category: string
  }
  dateTime: {
    date: string
    time: string
  }
  price: number
  commission: number
  payable: number
  status: "Pending" | "Paid"
}

export default function SettlementsContent() {
  const [selectedDate, setSelectedDate] = useState("Today, Oct 24")
  const [currentPage, setCurrentPage] = useState(1)

  const settlements: Settlement[] = [
    {
      id: "#BK-8892",
      technician: { name: "John Doe", techId: "T-404", avatar: "/thoughtful-man-portrait.png" },
      bookingId: "#BK-8892",
      service: { name: "AC Repair", category: "Maintenance" },
      dateTime: { date: "Oct 24", time: "02:30 PM" },
      price: 150.0,
      commission: 30.0,
      payable: 120.0,
      status: "Pending",
    },
    {
      id: "#BK-8893",
      technician: { name: "Sarah Smith", techId: "T-412", avatar: "/woman-portrait.png" },
      bookingId: "#BK-8893",
      service: { name: "Thermostat Install", category: "Installation" },
      dateTime: { date: "Oct 24", time: "01:15 PM" },
      price: 80.0,
      commission: 16.0,
      payable: 64.0,
      status: "Paid",
    },
    {
      id: "#BK-8894",
      technician: { name: "Mike Ross", techId: "T-309", avatar: "/professional-man.png" },
      bookingId: "#BK-8894",
      service: { name: "Vent Cleaning", category: "Cleaning" },
      dateTime: { date: "Oct 24", time: "11:00 AM" },
      price: 250.0,
      commission: 50.0,
      payable: 200.0,
      status: "Pending",
    },
    {
      id: "#BK-8895",
      technician: { name: "David Chen", techId: "T-552", avatar: "/technician-male.jpg" },
      bookingId: "#BK-8895",
      service: { name: "Emergency Repair", category: "Repair" },
      dateTime: { date: "Oct 24", time: "09:45 AM" },
      price: 450.0,
      commission: 90.0,
      payable: 360.0,
      status: "Pending",
    },
    {
      id: "#BK-8896",
      technician: { name: "Emily Davis", techId: "T-221", avatar: "/technician-female.jpg" },
      bookingId: "#BK-8896",
      service: { name: "Filter Replacement", category: "Maintenance" },
      dateTime: { date: "Oct 24", time: "08:30 AM" },
      price: 60.0,
      commission: 12.0,
      payable: 48.0,
      status: "Paid",
    },
  ]

  const totalServiceValue = 1200.0
  const totalPayable = 960.0
  const commission = 240.0
  const pendingPayouts = 3

  const handleMarkAllPaid = () => {
    console.log("[v0] Marking all settlements as paid")
  }

  // const handleGenerateReport = () => {
  //   console.log("[v0] Generating settlement report")
  // }


  const handleGenerateReport = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/settlements/download`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settlements }),
    }
  )

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "settlements-report.xlsx"
  a.click()

  window.URL.revokeObjectURL(url)
}
const token = localStorage.getItem("accessToken")

const handleSendEmail = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/settlements/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
        body: JSON.stringify({
          settlements,
          email: "metrocool@yopmail.com",
        }),
      }
    )

    // ❌ API failed (4xx / 5xx)
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData?.message || "Failed to send email")
    }

    // ✅ Only show success if API actually succeeds
    toast.success("Settlement report sent to your email 📧")

  } catch (error: any) {
    console.error("Send email error:", error)
    toast.error(error.message || "Something went wrong ❌")
  }
}


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settlement & Payouts</h1>
          <p className="text-gray-600 mt-1">Daily settlement view (8:00 AM - 8:00 PM)</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          Auto-email enabled
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Service Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalServiceValue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <span>↑</span>
                +5% vs yesterday
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Payable (80%)</p>
              <p className="text-3xl font-bold text-gray-900">${totalPayable.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">Ready for disbursement</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Commission (20%)</p>
              <p className="text-3xl font-bold text-gray-900">${commission.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-2">Platform revenue</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Pending Payouts</p>
              <p className="text-3xl font-bold text-gray-900">{pendingPayouts}</p>
              <p className="text-sm text-orange-600 mt-2">Action required</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today, Oct 24">Today, Oct 24</SelectItem>
                <SelectItem value="Yesterday">Yesterday</SelectItem>
                <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={handleSendEmail}>
  <Mail className="w-4 h-4 mr-2" />
  Send Email
</Button>

            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleMarkAllPaid}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark All Paid
            </Button>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comm (20%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={settlement.technician.avatar || "/placeholder.svg"}
                        alt={settlement.technician.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{settlement.technician.name}</p>
                        <p className="text-xs text-gray-500">Tech ID: {settlement.technician.techId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-blue-600">{settlement.bookingId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{settlement.service.name}</p>
                      <p className="text-xs text-gray-500">{settlement.service.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{settlement.dateTime.date}</p>
                      <p className="text-xs text-gray-500">{settlement.dateTime.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">${settlement.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-red-600">-${settlement.commission.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">${settlement.payable.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        settlement.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {settlement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      {settlement.status === "Pending" ? "Mark Paid" : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
            <span className="font-medium">24</span> results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              className={currentPage === 1 ? "bg-blue-500 hover:bg-blue-600" : ""}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(2)}>
              2
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(3)}>
              3
            </Button>
            <span className="px-2 text-gray-500">...</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
