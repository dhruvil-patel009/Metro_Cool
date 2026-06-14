"use client"

import { useEffect, useState } from "react"
import {
  Search, MoreVertical, Phone, Users, ShieldCheck, UserPlus, Loader2,
  ChevronLeft, ChevronRight,
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

function UserAvatar({ user }: { user: User }) {
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "U"
  if (user.profile_photo && !user.profile_photo.includes("placeholder")) {
    return (
      <img
        src={user.profile_photo}
        className="h-9 w-9 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100"
        alt=""
      />
    )
  }
  return (
    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
      {initials}
    </div>
  )
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
          icon={<Users className="w-5 h-5" style={{ color: "#f97316" }} />}
          accentColor="#f97316"
          accentLight="#fff7ed"
          loading={statsLoading}
        />
        <AdminStatCard
          label="Active Users"
          value={stats?.active ?? "—"}
          icon={<ShieldCheck className="w-5 h-5" style={{ color: "#10b981" }} />}
          accentColor="#10b981"
          accentLight="#ecfdf5"
          loading={statsLoading}
        />
        <AdminStatCard
          label="New This Month"
          value={stats?.newThisMonth ?? "—"}
          icon={<UserPlus className="w-5 h-5" style={{ color: "#8b5cf6" }} />}
          accentColor="#8b5cf6"
          accentLight="#f5f3ff"
          loading={statsLoading}
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9 bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:bg-white"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}>
              {["#", "User", "Phone", "Actions"].map((h, i) => (
                <th key={h} className={`px-6 py-3.5 text-left text-xs font-semibold text-white/70 uppercase tracking-wider ${i === 3 ? "text-center" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <AdminEmptyState title="No users found" description="Try adjusting your search." />
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
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

        <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/40">
          <p className="text-sm text-gray-500">
            {total > 0 ? `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total} users` : "No users"}
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="h-8 w-8 p-0 rounded-lg">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 px-2">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="h-8 w-8 p-0 rounded-lg">
              <ChevronRight className="w-4 h-4" />
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
                <UserAvatar user={user} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">#{(page - 1) * limit + index + 1}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user.id)}>
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              {user.phone}
            </div>
          </div>
        ))}
      </div>
    </AdminPageShell>
  )
}
