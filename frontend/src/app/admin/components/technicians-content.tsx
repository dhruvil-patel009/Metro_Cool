"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import {
  Users, UserCheck, UserX, Clock, Eye, MoreVertical,
  ChevronLeft, ChevronRight, Search, CheckCircle2,
  XCircle, Loader2, AlertCircle, RefreshCw, Phone,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { authHeaders } from "../../lib/authHeader"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { cn } from "@/app/lib/utils"

/* ─── Types ─── */
type ApiTechnician = {
  id: string
  services: string[]
  status: "active" | "inactive"
  approval_status: "approved" | "pending" | "rejected"
  profiles: {
    first_name: string
    last_name: string
    phone: string
    profile_photo: string | null
  }
}

type TechnicianUI = {
  id: string
  name: string
  techId: string
  phone: string
  services: string[]
  status: "Active" | "Inactive"
  approval: "Approved" | "Review" | "Rejected"
  avatar: string | null
}

const LIMIT = 8

const APPROVAL_STYLE: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
}

/* ─── Avatar helper ─── */
function Avatar({ src, name, size = 10 }: { src?: string | null; name: string; size?: number }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
  if (src && !src.includes("placeholder")) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`}
      />
    )
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm`}>
      {initials}
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  icon: Icon, label, value, iconBg, iconColor, badge,
}: {
  icon: React.ElementType; label: string; value: number | string
  iconBg: string; iconColor: string; badge?: { text: string; color: string }
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {badge && (
        <p className={`text-xs font-semibold mt-2 ${badge.color}`}>{badge.text}</p>
      )}
    </div>
  )
}

/* ─── Main Component ─── */
export default function TechniciansContent() {
  const router = useRouter()
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

  // List state
  const [technicians, setTechnicians] = useState<TechnicianUI[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")
  const [actionId, setActionId] = useState<string | null>(null)

  // Requests state
  const [requests, setRequests] = useState<ApiTechnician[]>([])
  const [requestActionId, setRequestActionId] = useState<string | null>(null)

  // Stats state
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, pending: 0 })

  /* ─── Fetch ─── */
  const fetchTechnicians = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${BASE}/admin/technicians?page=${page}&limit=${LIMIT}`,
        { headers: authHeaders() }
      )
      if (!res.ok) throw new Error()
      const json = await res.json()
      const raw: ApiTechnician[] = Array.isArray(json.data) ? json.data : []
      setTechnicians(raw.map(t => ({
        id: t.id,
        techId: t.id.slice(0, 8).toUpperCase(),
        name: `${t.profiles?.first_name ?? ""} ${t.profiles?.last_name ?? ""}`.trim(),
        phone: t.profiles?.phone ?? "",
        services: t.services ?? [],
        status: t.status === "active" ? "Active" : "Inactive",
        approval: t.approval_status === "approved" ? "Approved"
          : t.approval_status === "pending" ? "Review" : "Rejected",
        avatar: t.profiles?.profile_photo ?? null,
      })))
      setTotal(Number(json.total ?? 0))
    } catch {
      toast.error("Failed to load technicians")
    } finally {
      setLoading(false)
    }
  }, [page, BASE])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/admin/technicians/stats`, { headers: authHeaders() })
      if (!res.ok) return
      const d = await res.json()
      setStats({
        total: Number(d.total ?? 0),
        active: Number(d.active ?? 0),
        inactive: Number(d.inactive ?? 0),
        pending: Number(d.pending ?? 0),
      })
    } catch {}
  }, [BASE])

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/admin/technicians/requests`, { headers: authHeaders() })
      if (!res.ok) { setRequests([]); return }
      const json = await res.json()
      setRequests(Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [])
    } catch { setRequests([]) }
  }, [BASE])

  useEffect(() => {
    fetchTechnicians()
  }, [fetchTechnicians])

  useEffect(() => {
    fetchStats()
    fetchRequests()
  }, [fetchStats, fetchRequests])

  /* ─── Actions ─── */
  const toggleStatus = async (id: string, makeActive: boolean) => {
    setActionId(id)
    try {
      const res = await fetch(`${BASE}/admin/technicians/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: makeActive ? "active" : "inactive" }),
      })
      if (!res.ok) throw new Error()
      setTechnicians(prev => prev.map(t =>
        t.id === id ? { ...t, status: makeActive ? "Active" : "Inactive" } : t
      ))
      fetchStats()
      toast.success(makeActive ? "Technician activated" : "Technician deactivated")
    } catch {
      toast.error("Status update failed")
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    setActionId(id)
    try {
      const res = await fetch(`${BASE}/admin/technicians/${id}`, {
        method: "DELETE", headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      toast.success("Technician deleted")
      fetchTechnicians()
      fetchStats()
    } catch {
      toast.error("Delete failed")
    } finally {
      setActionId(null)
    }
  }

  const handleApprove = async (id: string) => {
    setRequestActionId(id)
    try {
      await fetch(`${BASE}/admin/technicians/${id}/approve`, {
        method: "PATCH", headers: authHeaders(),
      })
      toast.success("Technician approved")
      fetchTechnicians()
      fetchRequests()
      fetchStats()
    } catch {
      toast.error("Approval failed")
    } finally {
      setRequestActionId(null)
    }
  }

  const handleReject = async (id: string) => {
    setRequestActionId(id)
    try {
      await fetch(`${BASE}/admin/technicians/${id}/reject`, {
        method: "PATCH", headers: authHeaders(),
      })
      toast.success("Technician rejected")
      fetchRequests()
      fetchStats()
    } catch {
      toast.error("Rejection failed")
    } finally {
      setRequestActionId(null)
    }
  }

  /* ─── Derived ─── */
  const filtered = useMemo(() => {
    let list = technicians
    if (activeTab === "active") list = list.filter(t => t.status === "Active")
    if (activeTab === "inactive") list = list.filter(t => t.status === "Inactive")
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.techId.toLowerCase().includes(q) ||
        t.phone.includes(q)
      )
    }
    return list
  }, [technicians, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const formatPhone = (p: string) => {
    const d = p?.replace(/\D/g, "") ?? ""
    if (d.length !== 10) return p || "—"
    return `${d.slice(0, 5)} ${d.slice(5)}`
  }

  /* ─── UI ─── */
  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6 space-y-6">

        {/* ── Page Title ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage field technicians and approval requests</p>
          </div>
          <button
            onClick={() => { fetchTechnicians(); fetchStats(); fetchRequests() }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}     label="Total"    value={stats.total}    iconBg="bg-blue-50"   iconColor="text-blue-600" />
          <StatCard icon={UserCheck} label="Active"   value={stats.active}   iconBg="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard icon={UserX}     label="Inactive" value={stats.inactive}  iconBg="bg-red-50"    iconColor="text-red-500" />
          <StatCard
            icon={Clock} label="Pending Approval" value={stats.pending}
            iconBg="bg-amber-50" iconColor="text-amber-600"
            badge={stats.pending > 0 ? { text: "⚠ Action required", color: "text-amber-600" } : undefined}
          />
        </div>

        {/* ── Technicians Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-gray-100">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
              {(["all", "active", "inactive"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1) }}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={cn(
                    "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                    activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"
                  )}>
                    {tab === "all" ? stats.total
                      : tab === "active" ? stats.active
                      : stats.inactive}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, ID, phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Technician", "Phone", "Services", "Status", "Approval", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <AlertCircle className="w-8 h-8" />
                        <p className="font-medium">No technicians found</p>
                        {search && <p className="text-xs">Try a different search term</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(tech => (
                    <tr key={tech.id} className="hover:bg-gray-50/70 transition-colors group">
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={tech.avatar} name={tech.name} size={10} />
                          <div>
                            <p className="font-semibold text-gray-900">{tech.name}</p>
                            <p className="text-xs text-gray-400 font-mono">#{tech.techId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {formatPhone(tech.phone)}
                        </div>
                      </td>

                      {/* Services */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {tech.services.length > 0 ? tech.services.slice(0, 3).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                              {s}
                            </span>
                          )) : <span className="text-gray-400 text-xs">No services</span>}
                          {tech.services.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">
                              +{tech.services.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                          tech.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            tech.status === "Active" ? "bg-emerald-500" : "bg-gray-400"
                          )} />
                          {tech.status}
                        </span>
                      </td>

                      {/* Approval */}
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border",
                          APPROVAL_STYLE[tech.approval]
                        )}>
                          {tech.approval}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={actionId === tech.id}
                            >
                              {actionId === tech.id
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <MoreVertical className="w-4 h-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => router.push(`/admin/Technician/${tech.id}`)}>
                              <Eye className="w-4 h-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            {tech.status === "Active" ? (
                              <DropdownMenuItem onClick={() => toggleStatus(tech.id, false)} className="text-amber-600">
                                <UserX className="w-4 h-4 mr-2" /> Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => toggleStatus(tech.id, true)} className="text-emerald-600">
                                <UserCheck className="w-4 h-4 mr-2" /> Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(tech.id, tech.name)} className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 space-y-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-36" />
                      <div className="h-3 bg-gray-200 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium text-sm">No technicians found</p>
              </div>
            ) : (
              filtered.map(tech => (
                <div key={tech.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={tech.avatar} name={tech.name} size={10} />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{tech.name}</p>
                        <p className="text-xs text-gray-400 font-mono">#{tech.techId}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={actionId === tech.id}>
                          {actionId === tech.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <MoreVertical className="w-4 h-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => router.push(`/admin/Technician/${tech.id}`)}>
                          <Eye className="w-4 h-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        {tech.status === "Active" ? (
                          <DropdownMenuItem onClick={() => toggleStatus(tech.id, false)} className="text-amber-600">
                            <UserX className="w-4 h-4 mr-2" /> Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => toggleStatus(tech.id, true)} className="text-emerald-600">
                            <UserCheck className="w-4 h-4 mr-2" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(tech.id, tech.name)} className="text-red-600">
                          <XCircle className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    {formatPhone(tech.phone)}
                  </div>

                  {tech.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tech.services.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                          {s}
                        </span>
                      ))}
                      {tech.services.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">+{tech.services.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                      tech.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", tech.status === "Active" ? "bg-emerald-500" : "bg-gray-400")} />
                      {tech.status}
                    </span>
                    <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border", APPROVAL_STYLE[tech.approval])}>
                      {tech.approval}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50/40">
              <p className="text-sm text-gray-500">
                {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} technicians
              </p>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-gray-700 px-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Pending Requests ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Approval Requests</h2>
            {requests.length > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                {requests.length}
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-700">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">No pending technician requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {requests.map(r => {
                const name = `${r.profiles?.first_name ?? ""} ${r.profiles?.last_name ?? ""}`.trim()
                const isLoading = requestActionId === r.id
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={r.profiles?.profile_photo} name={name} size={12} />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-400 font-mono">#{r.id.slice(0, 8).toUpperCase()}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-xs text-amber-600 font-medium">Pending Approval</span>
                        </div>
                      </div>
                    </div>

                    {r.profiles?.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        {r.profiles.phone}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReject(r.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Reject"}
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleApprove(r.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => router.push(`/admin/Technician/${r.id}`)}
                        title="View profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
