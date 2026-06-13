"use client"

import { useEffect, useState } from "react"
import {
  Search, MoreVertical, Phone, Users, ShieldCheck, UserPlus, Loader2,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { AdminPageShell, AdminStatCard, AdminEmptyState } from "./admin-page-shell"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

type User = {
  id: string
  first_name: string
  last_name: string
  phone: string
  profile_photo: string | null
}

type UserStats = {
  total: number
  active: number
  inactive: number
  newThisMonth: number
}

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const [page, setPage] = useState(1)
  const limit = 10
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/users/stats`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      if (res.ok) setStats(await res.json())
    } catch {
      // stats are non-critical
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${API_URL}/admin/users?page=${page}&limit=${limit}`,
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      )

      if (!res.ok) {
        setUsers([])
        setTotal(0)
        return
      }

      const json = await res.json()
      setUsers(Array.isArray(json.data) ? json.data : [])
      setTotal(json.total ?? 0)
    } catch {
      setUsers([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { fetchUsers() }, [page])

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })

      if (!res.ok) {
        toast.error("Failed to delete user")
        return
      }

      setUsers(prev => prev.filter(u => u.id !== userId))
      setTotal(prev => Math.max(0, prev - 1))
      fetchStats()
      toast.success("User deleted")
    } catch {
      toast.error("Something went wrong")
    }
  }

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  )

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <AdminPageShell
      title="Users"
      description="Manage registered customer accounts."
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Total Users"
          value={stats?.total ?? total}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          loading={statsLoading}
        />
        <AdminStatCard
          label="Active Users"
          value={stats?.active ?? "—"}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          loading={statsLoading}
        />
        <AdminStatCard
          label="New This Month"
          value={stats?.newThisMonth ?? "—"}
          icon={<UserPlus className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-50"
          loading={statsLoading}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white border-gray-200 text-gray-900"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 tracking-wider">
            <tr>
              <th className="px-6 py-3.5 text-left">#</th>
              <th className="px-6 py-3.5 text-left">User</th>
              <th className="px-6 py-3.5 text-left">Phone</th>
              <th className="px-6 py-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <AdminEmptyState title="No users found" description="Try adjusting your search." />
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profile_photo || "/placeholder.svg"}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                        alt=""
                      />
                      <p className="font-semibold text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <Phone className="inline mr-2 h-4 w-4 text-gray-400" />
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} · {total} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : filteredUsers.map((user, index) => (
          <div key={user.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.profile_photo || "/placeholder.svg"}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-400">#{(page - 1) * limit + index + 1}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><MoreVertical /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user.id)}>
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              <Phone className="inline mr-2 h-4 w-4 text-gray-400" />
              {user.phone}
            </p>
          </div>
        ))}
      </div>
    </AdminPageShell>
  )
}
