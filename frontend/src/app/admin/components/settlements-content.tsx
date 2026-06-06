"use client"

import { useState, useEffect } from "react"
import {
  Calendar, Download, FileText, CheckCircle2,
  IndianRupee, Percent, Clock, Mail, Loader2, AlertCircle, X, Send
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { toast } from "react-toastify"

interface Settlement {
  id: string
  technician: { name: string; techId: string; avatar?: string }
  bookingId: string
  service: { name: string; category: string }
  dateTime: { date: string; time: string }
  price: number
  commission: number
  payable: number
  status: "Pending" | "Paid"
}

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(v)

const ITEMS_PER_PAGE = 8

/* ── Email Modal ── */
function EmailModal({
  onClose,
  onSend,
  loading,
}: {
  onClose: () => void
  onSend: (email: string) => void
  loading: boolean
}) {
  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_SETTLEMENT_EMAIL || ""
  )

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-blue-600" size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Send Settlement Report</p>
              <p className="text-xs text-gray-400 mt-0.5">Today's settlements will be emailed with Excel attachment</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@yourdomain.com"
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            onKeyDown={e => e.key === "Enter" && isValid && !loading && onSend(email)}
            autoFocus
          />
          {email && !isValid && (
            <p className="text-xs text-red-500 mt-1.5">Please enter a valid email address</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            The report will include today's settlement summary and a formatted Excel file.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={() => onSend(email)}
            disabled={!isValid || loading}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              : <><Send className="w-4 h-4" /> Send Report</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SettlementsContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!

  const token = () => localStorage.getItem("accessToken")

  const fetchSettlements = async () => {
    try {
      const res = await fetch(`${API}/settlements`, {
        headers: { Authorization: `Bearer ${token()}` },
      })
      const data = await res.json()
      setSettlements(data.settlements || [])
    } catch {
      toast.error("Failed to load settlements")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettlements() }, [])

  /* ── Stats ── */
  const totalServiceValue = settlements.reduce((a, s) => a + s.price, 0)
  const totalPayable = settlements.reduce((a, s) => a + s.payable, 0)
  const totalCommission = settlements.reduce((a, s) => a + s.commission, 0)
  const pendingCount = settlements.filter(s => s.status === "Pending").length

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(settlements.length / ITEMS_PER_PAGE))
  const paginated = settlements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  /* ── Actions ── */
  const markPaid = async (paymentId: string) => {
    setActionLoading(paymentId)
    try {
      const res = await fetch(`${API}/settlements/mark-paid/${paymentId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token()}` },
      })
      if (!res.ok) throw new Error()
      toast.success("Marked as paid")
      setSettlements(prev =>
        prev.map(s => s.id === paymentId ? { ...s, status: "Paid" } : s)
      )
    } catch {
      toast.error("Failed to update status")
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkAllPaid = async () => {
    setActionLoading("all")
    try {
      const res = await fetch(`${API}/settlements/mark-all-paid`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token()}` },
      })
      if (!res.ok) throw new Error()
      toast.success("All technicians marked paid")
      setSettlements(prev => prev.map(s => ({ ...s, status: "Paid" as const })))
    } catch {
      toast.error("Failed to mark all paid")
    } finally {
      setActionLoading(null)
    }
  }

  const handleGenerateReport = async () => {
    setActionLoading("download")
    try {
      const res = await fetch(`${API}/settlements/download`, {
        headers: { Authorization: `Bearer ${token()}` },
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `settlements-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      toast.error("Failed to download report")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendEmail = async (email: string) => {
    setActionLoading("email")
    try {
      const res = await fetch(`${API}/settlements/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to send")
      toast.success(`Settlement report sent to ${email}`)
      setShowEmailModal(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to send email")
    } finally {
      setActionLoading(null)
    }
  }

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
          loading={actionLoading === "email"}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settlement & Payouts</h1>
          <p className="text-gray-500 text-sm mt-0.5">Daily settlement — auto email at 8 PM</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Auto-email enabled
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Service Value",
            value: formatINR(totalServiceValue),
            sub: `${settlements.length} transactions`,
            icon: IndianRupee,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            subColor: "text-gray-500",
          },
          {
            label: "Total Payable (80%)",
            value: formatINR(totalPayable),
            sub: "Ready for disbursement",
            icon: CheckCircle2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            subColor: "text-emerald-600",
          },
          {
            label: "Platform Commission (20%)",
            value: formatINR(totalCommission),
            sub: "Platform revenue",
            icon: Percent,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            subColor: "text-gray-500",
          },
          {
            label: "Pending Payouts",
            value: String(pendingCount),
            sub: pendingCount > 0 ? "Action required" : "All settled",
            icon: Clock,
            iconBg: pendingCount > 0 ? "bg-amber-50" : "bg-green-50",
            iconColor: pendingCount > 0 ? "text-amber-600" : "text-green-600",
            subColor: pendingCount > 0 ? "text-amber-600" : "text-green-600",
          },
        ].map(({ label, value, sub, icon: Icon, iconBg, iconColor, subColor }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${iconColor}`} size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Actions Bar ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleGenerateReport} disabled={actionLoading === "download"}>
              {actionLoading === "download"
                ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                : <FileText className="w-4 h-4 mr-1.5" />}
              Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowEmailModal(true)} disabled={actionLoading === "email"}>
              {actionLoading === "email"
                ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                : <Mail className="w-4 h-4 mr-1.5" />}
              Send Email
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMarkAllPaid}
              disabled={actionLoading === "all" || pendingCount === 0}
            >
              {actionLoading === "all"
                ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
              Mark All Paid
            </Button>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {settlements.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-600">No settlements found</p>
          <p className="text-sm text-gray-400 mt-1">Completed bookings with captured payments will appear here</p>
        </div>
      )}

      {/* ── Desktop Table ── */}
      {settlements.length > 0 && (
        <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Technician", "Booking ID", "Service", "Date", "Price", "Comm (20%)", "Payable", "Status", "Action"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                          {s.technician.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 whitespace-nowrap">{s.technician.name}</p>
                          <p className="text-xs text-gray-400">ID: {String(s.technician.techId).slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                        #{String(s.bookingId).slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 whitespace-nowrap">{s.service.name || "AC Service"}</p>
                      <p className="text-xs text-gray-400">{s.service.category}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-600">{s.dateTime.date}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{formatINR(s.price)}</td>
                    <td className="px-5 py-4 font-medium text-red-500">-{formatINR(s.commission)}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">{formatINR(s.payable)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === "Paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Paid" ? "bg-green-500" : "bg-amber-500"}`} />
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {s.status === "Pending" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 text-xs px-3"
                          onClick={() => markPaid(s.id)}
                          disabled={actionLoading === s.id}
                        >
                          {actionLoading === s.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : "Mark Paid"}
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs px-3">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, settlements.length)} of {settlements.length}
            </p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  className={currentPage === i + 1 ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {settlements.length > 0 && (
        <div className="lg:hidden space-y-3">
          {paginated.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                    {s.technician.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{s.technician.name}</p>
                    <p className="text-xs text-gray-400">#{String(s.bookingId).slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  s.status === "Paid"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Paid" ? "bg-green-500" : "bg-amber-500"}`} />
                  {s.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Service</p>
                  <p className="font-medium text-gray-900">{s.service.name || "AC Service"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Date</p>
                  <p className="font-medium text-gray-900">{s.dateTime.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm bg-gray-50 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-0.5">Price</p>
                  <p className="font-semibold text-gray-900">{formatINR(s.price)}</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-gray-400 text-xs mb-0.5">Comm.</p>
                  <p className="font-semibold text-red-500">-{formatINR(s.commission)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-0.5">Payable</p>
                  <p className="font-bold text-gray-900">{formatINR(s.payable)}</p>
                </div>
              </div>

              {s.status === "Pending" && (
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => markPaid(s.id)}
                  disabled={actionLoading === s.id}
                >
                  {actionLoading === s.id
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing…</>
                    : <><CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Paid</>}
                </Button>
              )}
            </div>
          ))}

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
