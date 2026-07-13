"use client"

import { useState, useEffect } from "react"
import {
  Calendar, FileText, CheckCircle2,
  IndianRupee, Percent, Clock, Mail, Loader2, AlertCircle,
  X, Send, TrendingUp, Users, Filter, RefreshCw,
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
  commissionType: string
  commissionValue: number
  commission: number
  originalCommission?: number
  promoDiscount?: number
  promoCode?: string | null
  promoReferrerName?: string | null
  payable: number
  status: "Pending" | "Paid"
}

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(v)

const ITEMS_PER_PAGE = 10

/* ── Email Modal ── */
function EmailModal({
  onClose, onSend, loading,
}: { onClose: () => void; onSend: (email: string) => void; loading: boolean }) {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_SETTLEMENT_EMAIL || "")
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Send Settlement Report</p>
              <p className="text-xs text-gray-400 mt-0.5">Excel attachment with today&apos;s settlements</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="px-6 py-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@yourdomain.com"
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            onKeyDown={e => e.key === "Enter" && isValid && !loading && onSend(email)}
            autoFocus
          />
          {email && !isValid && <p className="text-xs text-red-500 mt-1.5">Please enter a valid email address</p>}
        </div>
        <div className="px-6 py-4 bg-gray-50/80 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => onSend(email)} disabled={!isValid || loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Report</>}
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
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Paid">("all")

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!
  const token = () => localStorage.getItem("accessToken")

  const fetchSettlements = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/settlements`, { headers: { Authorization: `Bearer ${token()}` } })
      const data = await res.json()
      setSettlements(data.settlements || [])
    } catch { toast.error("Failed to load settlements") }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSettlements() }, [])

  /* ── Filtered & Stats ── */
  const filtered = statusFilter === "all" ? settlements : settlements.filter(s => s.status === statusFilter)
  const totalServiceValue = settlements.reduce((a, s) => a + s.price, 0)
  const totalPayable = settlements.reduce((a, s) => a + s.payable, 0)
  const totalCommission = settlements.reduce((a, s) => a + s.commission, 0)
  const pendingCount = settlements.filter(s => s.status === "Pending").length
  const paidCount = settlements.filter(s => s.status === "Paid").length

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [statusFilter])

  /* ── Actions ── */
  const markPaid = async (paymentId: string) => {
    setActionLoading(paymentId)
    try {
      const res = await fetch(`${API}/settlements/mark-paid/${paymentId}`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token()}` },
      })
      if (!res.ok) throw new Error()
      toast.success("Marked as paid")
      setSettlements(prev => prev.map(s => s.id === paymentId ? { ...s, status: "Paid" } : s))
    } catch { toast.error("Failed to update status") }
    finally { setActionLoading(null) }
  }

  const handleMarkAllPaid = async () => {
    setActionLoading("all")
    try {
      const res = await fetch(`${API}/settlements/mark-all-paid`, {
        method: "PATCH", headers: { Authorization: `Bearer ${token()}` },
      })
      if (!res.ok) throw new Error()
      toast.success("All marked paid")
      setSettlements(prev => prev.map(s => ({ ...s, status: "Paid" as const })))
    } catch { toast.error("Failed to mark all paid") }
    finally { setActionLoading(null) }
  }

  const handleGenerateReport = async () => {
    setActionLoading("download")
    try {
      const res = await fetch(`${API}/settlements/download`, { headers: { Authorization: `Bearer ${token()}` } })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `settlements-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch { toast.error("Failed to download report") }
    finally { setActionLoading(null) }
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
      toast.success(`Report sent to ${email}`)
      setShowEmailModal(false)
    } catch (err: any) { toast.error(err?.message || "Failed to send email") }
    finally { setActionLoading(null) }
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
              <div className="h-3 w-20 bg-gray-100 rounded mb-4" />
              <div className="h-7 w-28 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal onClose={() => setShowEmailModal(false)} onSend={handleSendEmail} loading={actionLoading === "email"} />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settlement & Payouts</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage technician payments and commission reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchSettlements}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Auto-email at 8 PM
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Revenue</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatINR(totalServiceValue)}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{settlements.length} transactions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Commission</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatINR(totalCommission)}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Platform earnings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Tech Pay</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatINR(totalPayable)}</p>
            <p className="text-[10px] sm:text-xs text-emerald-600 mt-1">{paidCount} paid</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-1/2 translate-x-1/2 ${pendingCount > 0 ? "bg-amber-50" : "bg-green-50"}`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pendingCount > 0 ? "bg-amber-100" : "bg-green-100"}`}>
                <Clock className={`w-4 h-4 ${pendingCount > 0 ? "text-amber-600" : "text-green-600"}`} />
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide">Pending</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingCount}</p>
            <p className={`text-[10px] sm:text-xs mt-1 ${pendingCount > 0 ? "text-amber-600" : "text-green-600"}`}>
              {pendingCount > 0 ? "Needs attention" : "All settled"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(["all", "Pending", "Paid"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  statusFilter === f
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f === "all" ? "All" : f}
                <span className="ml-1.5 text-[10px] opacity-60">
                  {f === "all" ? settlements.length : f === "Pending" ? pendingCount : paidCount}
                </span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-gray-200" onClick={handleGenerateReport} disabled={actionLoading === "download"}>
              {actionLoading === "download" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-gray-200" onClick={() => setShowEmailModal(true)} disabled={actionLoading === "email"}>
              {actionLoading === "email" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Email Report</span>
              <span className="sm:hidden">Email</span>
            </Button>
            <Button
              size="sm" className="h-9 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleMarkAllPaid} disabled={actionLoading === "all" || pendingCount === 0}
            >
              {actionLoading === "all" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Mark All Paid
            </Button>
          </div>
        </div>
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-gray-300" />
          </div>
          <p className="font-semibold text-gray-700 text-base">No settlements found</p>
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
            {statusFilter !== "all" ? `No ${statusFilter.toLowerCase()} settlements.` : "Completed bookings with captured payments will appear here."}
          </p>
        </div>
      )}

      {/* ── Desktop Table ── */}
      {filtered.length > 0 && (
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 lg:px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                  <th className="px-4 lg:px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="px-4 lg:px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 lg:px-5 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 lg:px-5 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Commission</th>
                  <th className="px-4 lg:px-5 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Promo</th>
                  <th className="px-4 lg:px-5 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Payable</th>
                  <th className="px-4 lg:px-5 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 lg:px-5 py-3.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map(s => (
                  <tr key={s.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 lg:px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm">
                          {s.technician.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{s.technician.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">#{String(s.bookingId).slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-5 py-3.5">
                      <p className="font-medium text-gray-800 truncate max-w-[140px]">{s.service.name || "AC Service"}</p>
                    </td>
                    <td className="px-4 lg:px-5 py-3.5 whitespace-nowrap text-gray-500 text-xs">{s.dateTime.date}</td>
                    <td className="px-4 lg:px-5 py-3.5 text-right font-semibold text-gray-900">{formatINR(s.price)}</td>
                    <td className="px-4 lg:px-5 py-3.5 text-right">
                      <span className="font-semibold text-red-500">-{formatINR(s.commission)}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {s.commissionType === "flat" ? "Flat" : `${s.commissionValue ?? 20}%`}
                      </p>
                    </td>
                    <td className="px-4 lg:px-5 py-3.5 text-center">
                      {s.promoCode ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 ring-1 ring-violet-200 text-[10px] font-bold tracking-wide">
                            {s.promoCode}
                          </span>
                          {s.promoDiscount && s.promoDiscount > 0 ? (
                            <p className="text-[10px] text-green-600 font-medium mt-0.5">-{formatINR(s.promoDiscount)} off</p>
                          ) : null}
                          {s.promoReferrerName && (
                            <p className="text-[9px] text-gray-400 mt-0.5">by {s.promoReferrerName}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 lg:px-5 py-3.5 text-right font-bold text-gray-900">{formatINR(s.payable)}</td>
                    <td className="px-4 lg:px-5 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        s.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Paid" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-5 py-3.5 text-center">
                      {s.status === "Pending" ? (
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 text-[11px] text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold px-3"
                          onClick={() => markPaid(s.id)} disabled={actionLoading === s.id}
                        >
                          {actionLoading === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Pay"}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-300">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Totals Footer */}
              <tfoot>
                <tr className="bg-gray-50/80 border-t-2 border-gray-200">
                  <td colSpan={3} className="px-4 lg:px-5 py-4">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Summary Total</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{filtered.length} settlement(s)</p>
                  </td>
                  <td className="px-4 lg:px-5 py-4 text-right font-bold text-gray-900">{formatINR(totalServiceValue)}</td>
                  <td className="px-4 lg:px-5 py-4 text-right font-bold text-red-500">-{formatINR(totalCommission)}</td>
                  <td className="px-4 lg:px-5 py-4 text-center">
                    {settlements.some(s => s.promoDiscount && s.promoDiscount > 0) && (
                      <span className="text-[10px] font-semibold text-green-600">
                        -{formatINR(settlements.reduce((a, s) => a + (s.promoDiscount || 0), 0))}
                      </span>
                    )}
                  </td>
                  <td className="px-4 lg:px-5 py-4 text-right font-bold text-gray-900">{formatINR(totalPayable)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </Button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page} onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === page ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 5 && <span className="text-xs text-gray-300 px-1">...</span>}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {filtered.length > 0 && (
        <div className="md:hidden space-y-3">
          {paginated.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    {s.technician.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{s.technician.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">#{String(s.bookingId).slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  s.status === "Paid"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                }`}>
                  <span className={`w-1 h-1 rounded-full ${s.status === "Paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {s.status}
                </span>
              </div>

              {/* Service & Date */}
              <div className="px-4 pb-3 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium truncate">{s.service.name || "AC Service"}</span>
                <span className="text-gray-400 shrink-0 ml-2">{s.dateTime.date}</span>
              </div>

              {/* Financial Grid */}
              <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
                <div className="py-3 text-center">
                  <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Price</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{formatINR(s.price)}</p>
                </div>
                <div className="py-3 text-center">
                  <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">
                    Comm ({s.commissionType === "flat" ? "Flat" : `${s.commissionValue ?? 20}%`})
                  </p>
                  <p className="text-sm font-bold text-red-500 mt-0.5">-{formatINR(s.commission)}</p>
                </div>
                <div className="py-3 text-center">
                  <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">Payable</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatINR(s.payable)}</p>
                </div>
              </div>

              {/* Promo Code Badge (mobile) */}
              {s.promoCode && (
                <div className="px-4 py-2 border-t border-gray-100 bg-violet-50/50 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 ring-1 ring-violet-200 text-[10px] font-bold tracking-wide">
                    🎟️ {s.promoCode}
                  </span>
                  {s.promoDiscount && s.promoDiscount > 0 ? (
                    <span className="text-[10px] text-green-600 font-semibold">-{formatINR(s.promoDiscount)} discount</span>
                  ) : null}
                  {s.promoReferrerName && (
                    <span className="text-[9px] text-gray-500 ml-auto">Ref: {s.promoReferrerName}</span>
                  )}
                </div>
              )}

              {/* Action */}
              {s.status === "Pending" && (
                <div className="border-t border-gray-100 p-3">
                  <Button
                    size="sm" className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
                    onClick={() => markPaid(s.id)} disabled={actionLoading === s.id}
                  >
                    {actionLoading === s.id
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...</>
                      : <><CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid</>}
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Mobile Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-5 text-white">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">Settlement Summary</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Revenue</p>
                <p className="text-sm font-bold mt-0.5">{formatINR(totalServiceValue)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Commission</p>
                <p className="text-sm font-bold text-red-400 mt-0.5">{formatINR(totalCommission)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Tech Pay</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{formatINR(totalPayable)}</p>
              </div>
            </div>
          </div>

          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <p className="text-xs text-gray-400">Page {currentPage}/{totalPages}</p>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
