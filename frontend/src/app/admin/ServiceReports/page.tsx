"use client"

import { useEffect, useState } from "react"
import {
  ClipboardCheck,
  Search,
  Eye,
  Calendar,
  User,
  Wrench,
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  Download,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminPageShell, AdminLoadingState, AdminEmptyState } from "../components/admin-page-shell"

const API = process.env.NEXT_PUBLIC_API_BASE_URL!

type ServiceReport = {
  id: string
  job_id: string
  issue_description: string
  fix_applied: string
  additional_notes: string
  photos: string[]
  status: string
  created_at: string
  bookings: {
    id: string
    booking_date: string
    job_status: string
    user: { full_name: string; phone: string; email: string }
    technician: { full_name: string; phone: string; email: string }
  }
}

export default function AdminServiceReportsPage() {
  const [reports, setReports] = useState<ServiceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
      const res = await fetch(`${API}/service-report/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setReports(data.reports)
    } catch (err) {
      console.error("Failed to fetch service reports", err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase()
    return (
      r.bookings?.technician?.full_name?.toLowerCase().includes(q) ||
      r.bookings?.user?.full_name?.toLowerCase().includes(q) ||
      r.issue_description?.toLowerCase().includes(q) ||
      r.job_id?.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (d: string) => {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
        onImageClick={setLightboxImg}
        lightboxImg={lightboxImg}
        onCloseLightbox={() => setLightboxImg(null)}
        formatDate={formatDate}
      />
    )
  }

  return (
    <AdminPageShell
      title="Service Completion Reports"
      description="View all technician service completion reports and proof of work."
    >
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by technician, customer, issue, or job ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <Filter className="w-4 h-4" />
          <span>{filtered.length} report{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <AdminLoadingState label="Loading service reports…" />
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          title="No service reports found"
          description={search ? "Try adjusting your search query." : "No technicians have submitted reports yet."}
        />
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Technician</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Issue</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Photos</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((report) => (
                    <tr key={report.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{report.bookings?.technician?.full_name || "—"}</p>
                            <p className="text-xs text-gray-400">{report.bookings?.technician?.phone || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700">{report.bookings?.user?.full_name || "—"}</p>
                        <p className="text-xs text-gray-400">{report.bookings?.user?.phone || ""}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700 truncate max-w-[200px]">{report.issue_description || "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(report.created_at)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 font-medium">{report.photos?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          report.status === "submitted"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {report.status || "submitted"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
                <p className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages} ({filtered.length} total)
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageShell>
  )
}

/* ─────────────────────────────────────────────────────────
   DETAIL VIEW (shared between admin & technician)
───────────────────────────────────────────────────────── */

function ReportDetailView({
  report,
  onBack,
  onImageClick,
  lightboxImg,
  onCloseLightbox,
  formatDate,
}: {
  report: ServiceReport
  onBack: () => void
  onImageClick: (url: string) => void
  lightboxImg: string | null
  onCloseLightbox: () => void
  formatDate: (d: string) => string
}) {
  return (
    <div className="min-h-full">
      <div className="p-5 lg:p-7 max-w-[1200px] mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Reports
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Completion Report</h1>
            <p className="text-sm text-gray-400 mt-1">Job #{report.job_id?.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
                  const res = await fetch(`${API}/service-report/download/${report.job_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  if (!res.ok) throw new Error("Failed to download")
                  const blob = await res.blob()
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `service-report-${report.job_id.slice(0, 8)}.pdf`
                  a.click()
                  window.URL.revokeObjectURL(url)
                } catch (err) {
                  console.error("Download error:", err)
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
              report.status === "submitted"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              <ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />
              {report.status?.toUpperCase() || "SUBMITTED"}
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Technician */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</p>
            </div>
            <p className="font-bold text-gray-900">{report.bookings?.technician?.full_name || "—"}</p>
            <p className="text-sm text-gray-500 mt-0.5">{report.bookings?.technician?.phone || ""}</p>
            <p className="text-sm text-gray-400">{report.bookings?.technician?.email || ""}</p>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
            </div>
            <p className="font-bold text-gray-900">{report.bookings?.user?.full_name || "—"}</p>
            <p className="text-sm text-gray-500 mt-0.5">{report.bookings?.user?.phone || ""}</p>
            <p className="text-sm text-gray-400">{report.bookings?.user?.email || ""}</p>
          </div>

          {/* Date & Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</p>
            </div>
            <p className="font-bold text-gray-900">{formatDate(report.created_at)}</p>
            <p className="text-sm text-gray-500 mt-0.5">Booking: {report.bookings?.booking_date || "—"}</p>
            <p className="text-sm text-gray-400">Job Status: {report.bookings?.job_status || "—"}</p>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900">Report Details</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Issue Description */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Issue Description</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.issue_description || "—"}</p>
              </div>
            </div>

            {/* Fix Applied */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fix Applied</p>
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.fix_applied || "—"}</p>
              </div>
            </div>

            {/* Additional Notes */}
            {report.additional_notes && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Additional Notes</p>
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{report.additional_notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Proof of Work Photos */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900">Proof of Work Photos</h2>
            <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {report.photos?.length || 0} photo{(report.photos?.length || 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="p-6">
            {!report.photos || report.photos.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No photos uploaded</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {report.photos.map((url, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group relative"
                    onClick={() => onImageClick(url)}
                  >
                    <img
                      src={url}
                      alt={`Proof of work ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
              onClick={onCloseLightbox}
            >
              <button
                onClick={onCloseLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={lightboxImg}
                alt="Proof of work full view"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
