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
  ArrowLeft,
  Download,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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

export default function TechnicianServiceReportsPage() {
  const [reports, setReports] = useState<ServiceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
      const res = await fetch(`${API}/service-report/my`, {
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
      r.bookings?.user?.full_name?.toLowerCase().includes(q) ||
      r.issue_description?.toLowerCase().includes(q) ||
      r.fix_applied?.toLowerCase().includes(q) ||
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

  /* ─── Detail View ─── */
  if (selectedReport) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
          {/* Back */}
          <button
            onClick={() => setSelectedReport(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Reports
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Service Completion Report
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Job #{selectedReport.job_id?.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("accessToken") || localStorage.getItem("token")
                    const res = await fetch(`${API}/service-report/download/${selectedReport.job_id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    if (!res.ok) throw new Error("Failed to download")
                    const blob = await res.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = `service-report-${selectedReport.job_id.slice(0, 8)}.pdf`
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
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                <ClipboardCheck className="w-3.5 h-3.5 mr-1.5" />
                {selectedReport.status?.toUpperCase() || "SUBMITTED"}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
              </div>
              <p className="font-bold text-slate-900">{selectedReport.bookings?.user?.full_name || "—"}</p>
              <p className="text-sm text-slate-500 mt-0.5">{selectedReport.bookings?.user?.phone || ""}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date Info</p>
              </div>
              <p className="font-bold text-slate-900">Submitted: {formatDate(selectedReport.created_at)}</p>
              <p className="text-sm text-slate-500 mt-0.5">Booking: {selectedReport.bookings?.booking_date || "—"}</p>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900">Report Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Description</p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedReport.issue_description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fix Applied</p>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedReport.fix_applied}</p>
                </div>
              </div>

              {selectedReport.additional_notes && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Notes</p>
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedReport.additional_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900">Proof of Work Photos</h2>
              <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {selectedReport.photos?.length || 0} photo{(selectedReport.photos?.length || 0) !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="p-6">
              {!selectedReport.photos || selectedReport.photos.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No photos uploaded</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedReport.photos.map((url, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer group relative"
                      onClick={() => setLightboxImg(url)}
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
                onClick={() => setLightboxImg(null)}
              >
                <button
                  onClick={() => setLightboxImg(null)}
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
        </main>
      </div>
    )
  }

  /* ─── List View ─── */
  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Service Reports
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View your completed service reports and proof of work.
            </p>
          </div>
          <Link
            href="/technician/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by customer, issue, or job ID..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading your reports…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-slate-700 font-semibold">
              {search ? "No reports match your search" : "No service reports yet"}
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              {search
                ? "Try adjusting your search query."
                : "Complete a job and submit a report to see it here."}
            </p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {report.bookings?.user?.full_name || "Customer"}
                        </p>
                        <p className="text-xs text-slate-400">
                          Job #{report.job_id?.slice(0, 6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {formatDate(report.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {report.issue_description || "No description"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">
                        {report.photos?.length || 0} photo{(report.photos?.length || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-blue-500 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-500 font-medium px-3">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
