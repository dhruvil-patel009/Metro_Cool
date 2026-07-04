"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import {
  Search, Headphones, Loader2, CheckCircle2,
  AlertCircle, Clock, XCircle, Ticket, User,
  Mail, Phone, MessageSquare, Filter,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { cn } from "@/app/lib/utils"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const API = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

/* ── Types ── */
interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  admin_note?: string
  created_at: string
  updated_at: string
  profiles?: {
    first_name: string
    last_name: string
    phone: string
    email: string
    role: string
  }
}

/* ── Fetch tickets ── */
const fetchAllTickets = async (): Promise<SupportTicket[]> => {
  const res = await fetch(`${API}/support/tickets`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.tickets) ? json.tickets : []
}

/* ── Status config ── */
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
  open:        { label: "Open",        color: "bg-amber-100 text-amber-700 border-amber-200",       bg: "bg-amber-50",    icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200",         bg: "bg-blue-50",     icon: Clock },
  resolved:    { label: "Resolved",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", bg: "bg-emerald-50",  icon: CheckCircle2 },
  closed:      { label: "Closed",      color: "bg-slate-100 text-slate-600 border-slate-200",      bg: "bg-slate-50",    icon: XCircle },
}

const categoryColors: Record<string, string> = {
  general:   "bg-slate-100 text-slate-600",
  payment:   "bg-green-100 text-green-700",
  job:       "bg-blue-100 text-blue-700",
  account:   "bg-purple-100 text-purple-700",
  technical: "bg-orange-100 text-orange-700",
}

export default function AdminSupportPage() {
  const qc = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [adminNote, setAdminNote] = useState("")
  const [newStatus, setNewStatus] = useState("")

  /* ── Data ── */
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["admin-support-tickets"],
    queryFn: fetchAllTickets,
    refetchInterval: 15_000,
    staleTime: 10_000,
  })

  /* ── Update ticket mutation ── */
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_note }: { id: string; status?: string; admin_note?: string }) => {
      const res = await fetch(`${API}/support/tickets/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, admin_note }),
      })
      if (!res.ok) throw new Error("Update failed")
      return res.json()
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-support-tickets"] })
      if (data.ticket) setSelectedTicket(data.ticket)
      toast.success("Ticket updated successfully")
    },
    onError: () => toast.error("Failed to update ticket"),
  })

  /* ── Filters ── */
  const filteredTickets = useMemo(() => {
    let list = tickets
    if (statusFilter !== "all") {
      list = list.filter(t => t.status === statusFilter)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        (t.profiles?.first_name || "").toLowerCase().includes(q) ||
        (t.profiles?.last_name || "").toLowerCase().includes(q) ||
        (t.profiles?.email || "").toLowerCase().includes(q)
      )
    }
    return list
  }, [tickets, statusFilter, searchQuery])

  /* ── Stats ── */
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in_progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  }

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket)
    setAdminNote(ticket.admin_note || "")
    setNewStatus(ticket.status)
  }

  const handleUpdateTicket = () => {
    if (!selectedTicket) return
    updateMutation.mutate({
      id: selectedTicket.id,
      status: newStatus || undefined,
      admin_note: adminNote || undefined,
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-2 sm:px-0">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 rounded-xl">
            <Headphones className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Support Tickets</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and respond to user support requests</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Tickets",  value: stats.total,      color: "text-slate-900",   bg: "bg-slate-50",   icon: Ticket },
          { label: "Open",           value: stats.open,       color: "text-amber-600",   bg: "bg-amber-50",   icon: AlertCircle },
          { label: "In Progress",    value: stats.inProgress, color: "text-blue-600",    bg: "bg-blue-50",    icon: Clock },
          { label: "Resolved",       value: stats.resolved,   color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <Card key={label} className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", bg)}>
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black">{value}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filters ── */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, subject, or ticket ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-slate-200 bg-slate-50 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { v: "all",         l: "All" },
              { v: "open",        l: "Open" },
              { v: "in_progress", l: "In Progress" },
              { v: "resolved",    l: "Resolved" },
              { v: "closed",      l: "Closed" },
            ].map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setStatusFilter(v)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-bold border transition-all",
                  statusFilter === v
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Tickets Table (Desktop) ── */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="font-medium">Loading tickets…</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <Ticket className="w-10 h-10 text-slate-200" />
          <p className="font-medium">No tickets found</p>
          <p className="text-sm">
            {searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "No support tickets have been submitted yet"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="border-slate-200 shadow-sm hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => {
                    const cfg = statusConfig[ticket.status] || statusConfig.open
                    const StatusIcon = cfg.icon
                    const userName = ticket.profiles
                      ? `${ticket.profiles.first_name || ""} ${ticket.profiles.last_name || ""}`.trim()
                      : "Unknown"
                    return (
                      <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                              <p className="text-[11px] text-slate-400 truncate">{ticket.profiles?.email || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[200px]">{ticket.subject}</p>
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md capitalize border-0", categoryColors[ticket.category] || categoryColors.general)}>
                            {ticket.category}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg border", cfg.color)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {cfg.label}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-500">{dayjs(ticket.created_at).fromNow()}</p>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenTicket(ticket)}
                            className="text-xs font-bold bg-transparent border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 cursor-pointer"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTickets.map((ticket) => {
              const cfg = statusConfig[ticket.status] || statusConfig.open
              const StatusIcon = cfg.icon
              const userName = ticket.profiles
                ? `${ticket.profiles.first_name || ""} ${ticket.profiles.last_name || ""}`.trim()
                : "Unknown"
              return (
                <Card
                  key={ticket.id}
                  className="border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleOpenTicket(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{userName}</p>
                          <p className="text-[11px] text-slate-400">{ticket.profiles?.role || "user"}</p>
                        </div>
                      </div>
                      <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0", cfg.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{ticket.subject}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{ticket.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md capitalize border-0", categoryColors[ticket.category] || categoryColors.general)}>
                        {ticket.category}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-medium">{dayjs(ticket.created_at).fromNow()}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* ── Ticket Detail + Action Dialog ── */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (() => {
            const cfg = statusConfig[selectedTicket.status] || statusConfig.open
            const StatusIcon = cfg.icon
            const userName = selectedTicket.profiles
              ? `${selectedTicket.profiles.first_name || ""} ${selectedTicket.profiles.last_name || ""}`.trim()
              : "Unknown User"
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-500" />
                    Ticket Details
                  </DialogTitle>
                  <DialogDescription className="sr-only">View and manage support ticket</DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                  {/* User Info */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Submitted By</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{userName}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                          {selectedTicket.profiles?.email && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {selectedTicket.profiles.email}
                            </span>
                          )}
                          {selectedTicket.profiles?.phone && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {selectedTicket.profiles.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold capitalize border-0">
                        {selectedTicket.profiles?.role || "user"}
                      </Badge>
                    </div>
                  </div>

                  {/* Status + Category */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={cn("text-xs font-bold px-3 py-1 rounded-lg border", cfg.color)}>
                      <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                      {cfg.label}
                    </Badge>
                    <Badge className={cn("text-xs font-bold px-3 py-1 rounded-lg capitalize border-0", categoryColors[selectedTicket.category] || categoryColors.general)}>
                      {selectedTicket.category}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium ml-auto">
                      {dayjs(selectedTicket.created_at).format("MMM D, YYYY • h:mm A")}
                    </span>
                  </div>

                  {/* Subject */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                    <p className="text-base font-bold text-slate-900">{selectedTicket.subject}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {/* Ticket ID */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span>ID: <span className="font-mono">{selectedTicket.id.slice(0, 12)}…</span></span>
                    <span>Updated: {dayjs(selectedTicket.updated_at).fromNow()}</span>
                  </div>

                  {/* ── Admin Actions ── */}
                  <div className="border-t border-slate-200 pt-5 space-y-4">
                    <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      Admin Actions
                    </p>

                    {/* Status Change */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">Update Status</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { v: "open",        l: "Open",        c: "border-amber-300 text-amber-700 bg-amber-50" },
                          { v: "in_progress", l: "In Progress", c: "border-blue-300 text-blue-700 bg-blue-50" },
                          { v: "resolved",    l: "Resolved",    c: "border-emerald-300 text-emerald-700 bg-emerald-50" },
                          { v: "closed",      l: "Closed",      c: "border-slate-300 text-slate-600 bg-slate-50" },
                        ].map(({ v, l, c }) => (
                          <button
                            key={v}
                            onClick={() => setNewStatus(v)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all",
                              newStatus === v
                                ? c + " ring-2 ring-offset-1 ring-slate-300"
                                : "border-slate-200 text-slate-500 bg-white hover:border-slate-400"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Admin Note */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600">Admin Note (internal)</label>
                      <textarea
                        rows={3}
                        placeholder="Add a note about this ticket (only visible to admins)..."
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-purple-500 focus:ring-purple-500/20 focus:ring-[3px] outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button variant="outline" onClick={() => setSelectedTicket(null)} className="bg-transparent">
                    Close
                  </Button>
                  <Button
                    onClick={handleUpdateTicket}
                    disabled={updateMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 font-bold"
                  >
                    {updateMutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</>
                      : "Update Ticket"
                    }
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
