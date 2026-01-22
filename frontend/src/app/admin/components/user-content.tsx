"use client"

import { useState } from "react"
import { Search, Filter, MoreVertical, Mail, Phone, Plus, Users, ShieldCheck, UserPlus } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"

const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Homeowner",
    email: "john.d@example.com",
    phone: "+1 (555) 123-4567",
    bookings: 12,
    status: "Active",
    avatar: "/thoughtful-man-portrait.png",
  },
  {
    id: 2,
    name: "Emily Smith",
    role: "Property Manager",
    email: "emily.estates@example.com",
    phone: "+1 (555) 987-6543",
    bookings: 45,
    status: "Active",
    avatar: "/woman-portrait.png",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Homeowner",
    email: "m.chen@example.com",
    phone: "+1 (555) 345-6789",
    bookings: 0,
    status: "Blocked",
    avatar: "/professional-man.png",
  },
  {
    id: 4,
    name: "Sarah Connor",
    role: "Homeowner",
    email: "s.connor@example.com",
    phone: "+1 (555) 777-9999",
    bookings: 3,
    status: "Inactive",
    avatar: "/technician-female.jpg",
  },
]

export default function UsersContent() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleAllUsers = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        {/* <Button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-200 hover:shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Total Users */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">2,543</p>
              <p className="mt-1 flex items-center text-sm font-medium text-green-600">
                <span className="mr-1">↑</span>
                +12% from last month
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 transition-transform duration-200 hover:scale-110">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">2,102</p>
              <p className="mt-1 flex items-center text-sm font-medium text-green-600">
                <span className="mr-1">↑</span>
                +5% increase
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 transition-transform duration-200 hover:scale-110">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* New This Month */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">145</p>
              <p className="mt-1 flex items-center text-sm font-medium text-gray-500">
                <span className="mr-1">→</span>
                Stable
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 transition-transform duration-200 hover:scale-110">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-shadow duration-200 focus:shadow-sm text-black"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] transition-shadow duration-200 hover:shadow-sm text-black">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="homeowner">Homeowner</SelectItem>
              <SelectItem value="manager">Property Manager</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] transition-shadow duration-200 hover:shadow-sm text-black">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="transition-all duration-200 hover:bg-gray-50 bg-transparent text-black">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={toggleAllUsers}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="transition-colors duration-150 hover:bg-gray-50"
                  style={{
                    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`,
                  }}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-2 h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-2 h-4 w-4 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                      {user.bookings}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                        user.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : user.status === "Blocked"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-green-600"
                            : user.status === "Blocked"
                              ? "bg-red-600"
                              : "bg-gray-500"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="transition-all duration-200 hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>View Bookings</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          {user.status === "Blocked" ? "Unblock User" : "Block User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">Showing 1 to 4 of 1,248 results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="transition-all duration-200 bg-transparent">
              Previous
            </Button>
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-200">
              1
            </Button>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-50 bg-transparent">
              2
            </Button>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-50 bg-transparent">
              3
            </Button>
            <span className="px-2 text-gray-400">...</span>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-50 bg-transparent">
              12
            </Button>
            <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-50 bg-transparent">
              Next
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
