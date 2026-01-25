"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Filter,
  MoreVertical,
  Phone,
  Users,
  ShieldCheck,
  UserPlus,
} from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/* ================= TYPES ================= */

type User = {
  id: string
  first_name: string
  last_name: string
  phone: string
  profile_photo: string | null
}

/* ================= COMPONENT ================= */

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const limit = 10
  const [total, setTotal] = useState(0)

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState("")

  // 🔐 ADMIN TOKEN
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    setLoading(true)

    try {
      const res = await fetch(
        `${API_URL}/admin/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      if (!res.ok) {
        setUsers([])
        setTotal(0)
        return
      }

      const json = await res.json()
      setUsers(Array.isArray(json.data) ? json.data : [])
      setTotal(json.total ?? 0)
    } catch (error) {
      console.error("Fetch users error:", error)
      setUsers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  /* ================= DELETE USER ================= */

  const deleteUser = async (userId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        `${API_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )

      if (!res.ok) {
        alert("Failed to delete user")
        return
      }

      // ✅ Update UI instantly
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
      setTotal((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Delete user error:", error)
      alert("Something went wrong")
    }
  }

  /* ================= SELECTION ================= */

  const toggleAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === users.length
        ? []
        : users.map((u) => u.id)
    )
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  /* ================= FILTER ================= */

  const filteredUsers = users.filter((u) =>
    `${u.first_name} ${u.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(total / limit))
  

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>

      {/* STATS (STATIC UI FOR NOW) */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={total} icon={<Users />} />
        <StatCard title="Active Users" value="—" icon={<ShieldCheck />} />
        <StatCard title="New This Month" value="—" icon={<UserPlus />} />
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">
               sr no
              </th>
              <th className="px-6 py-3 text-left">Profile img</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

<tbody className="divide-y">
  {filteredUsers.map((user, index) => (
    <tr key={user.id} className="hover:bg-gray-50">
      {/* SR NO */}
      <td className="px-6 py-4 font-medium text-gray-700">
        {(page - 1) * limit + index + 1}
      </td>

      {/* USER */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={user.profile_photo || "/placeholder.svg"}
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <p className="font-semibold">
            {user.first_name} {user.last_name}
          </p>
        </div>
      </td>

      {/* PHONE */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <Phone className="inline mr-2 h-4 w-4" />
        {user.phone}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-4 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deleteUser(user.id)}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  ))}
</tbody>

        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between p-4 border-t">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="rounded-lg border bg-white p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
    </div>
  )
}
