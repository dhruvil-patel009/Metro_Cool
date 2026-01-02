"use client"

import { useState } from "react"
import { Users, UserCheck, Clock, Plus, Filter, Eye, MoreVertical } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import Image from "next/image"
import { Header } from "./headers"

type Technician = {
  id: string
  name: string
  techId: string
  phone: string
  services: string[]
  status: "Active" | "Inactive" | "On Leave"
  approval: "Approved" | "Review" | "Pending"
  avatar: string
}

type TechnicianRequest = {
  id: string
  name: string
  appliedAt: string
  certifications: string[]
  avatar: string
  isNew: boolean
}

const technicians: Technician[] = [
  {
    id: "1",
    name: "John Doe",
    techId: "TC-8842",
    phone: "(555) 123-4567",
    services: ["AC Repair", "Installation"],
    status: "Active",
    approval: "Approved",
    avatar: "/thoughtful-man-portrait.png",
  },
  {
    id: "2",
    name: "Sarah Smith",
    techId: "TC-8843",
    phone: "(555) 987-6543",
    services: ["Maintenance"],
    status: "Inactive",
    approval: "Approved",
    avatar: "/woman-portrait.png",
  },
  {
    id: "3",
    name: "David Miller",
    techId: "TC-8845",
    phone: "(555) 456-7890",
    services: ["Heat Pumps", "Emergency"],
    status: "Active",
    approval: "Review",
    avatar: "/professional-man.png",
  },
]

const requests: TechnicianRequest[] = [
  {
    id: "1",
    name: "Mike Johnson",
    appliedAt: "Applied 2 hours ago",
    certifications: ["HVAC Certified", "5yr Exp"],
    avatar: "/technician-male.jpg",
    isNew: true,
  },
  {
    id: "2",
    name: "Emily Chen",
    appliedAt: "Applied 5 hours ago",
    certifications: ["Electrician", "Heat Specialist"],
    avatar: "/technician-female.jpg",
    isNew: false,
  },
]

export default function TechniciansContent() {
  const [activeTab, setActiveTab] = useState<"all" | "leave" | "inactive">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const handleApprove = (id: string, name: string) => {
    console.log(`[v0] Approving technician request: ${name} (${id})`)
    // Handle approval logic
  }

  const handleReject = (id: string, name: string) => {
    console.log(`[v0] Rejecting technician request: ${name} (${id})`)
    // Handle rejection logic
  }

  const handleViewDetails = (id: string) => {
    console.log(`[v0] Viewing details for request: ${id}`)
    // Handle view details logic
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <Header />

      <main className="p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600">Total Technicians</span>
              <div className="p-2 bg-cyan-50 rounded-lg">
                <Users className="w-5 h-5 text-cyan-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">124</h3>
              <span className="text-sm text-green-600 flex items-center mb-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                +12%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600">Active Now</span>
              <div className="p-2 bg-green-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">86</h3>
              <span className="text-sm text-green-600 flex items-center mb-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                +5%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600">Pending Requests</span>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold">5</h3>
              <span className="text-sm text-orange-600 font-medium mb-1">! Action Needed</span>
            </div>
          </div>
        </div>

        {/* Technicians Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "all" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Technicians
                </button>
                <button
                  onClick={() => setActiveTab("leave")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "leave" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  On Leave
                </button>
                <button
                  onClick={() => setActiveTab("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "inactive" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Inactive
                </button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="w-4 h-4" />
                  Add Technician
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Services Assigned
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Approval
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={tech.avatar || "/placeholder.svg"}
                          alt={tech.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{tech.name}</div>
                          <div className="text-sm text-gray-500">ID: {tech.techId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{tech.phone}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        {tech.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tech.status === "Active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">{tech.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          tech.approval === "Approved" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {tech.approval === "Approved" ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
                          </svg>
                        )}
                        {tech.approval}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign Services</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing 1-3 of 124</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Technician Requests */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Technician Requests</h2>
          <button className="text-cyan-500 hover:text-cyan-600 font-medium text-sm flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg p-6 shadow-sm relative">
              {request.isNew && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                  New
                </span>
              )}

              <div className="flex items-start gap-4 mb-4">
                <Image
                  src={request.avatar || "/placeholder.svg"}
                  alt={request.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{request.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{request.appliedAt}</p>
                  <div className="flex flex-wrap gap-2">
                    {request.certifications.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleReject(request.id, request.name)}
                >
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                  onClick={() => handleApprove(request.id, request.name)}
                >
                  Approve
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleViewDetails(request.id)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
