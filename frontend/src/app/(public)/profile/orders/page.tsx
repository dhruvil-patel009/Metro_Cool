"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight, ChevronLeft, Clock, CheckCircle,
  ShoppingBag, Wrench, CalendarDays, Download,
  Star, Navigation, Loader2, AlertCircle, FileText,
  IndianRupee, XCircle,
} from "lucide-react"
import { ProfileSidebar } from "../../components/profile-sidebar"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Button } from "@/app/components/ui/button"

import { apiFetch } from "@/app/lib/api"
import { OrdersSkeletonList } from "@/app/components/ui/PageLoader"

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(v)

/* ─── Status config ─── */
const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open:           { label: "Pending",     color: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-500" },
  assigned:       { label: "Assigned",    color: "bg-blue-50 text-blue-700 border-blue-200",       dot: "bg-blue-500 animate-pulse" },
  on_the_way:     { label: "On the Way",  color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500 animate-pulse" },
  working:        { label: "In Progress", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500 animate-pulse" },
  report_submitted: { label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  completed:      { label: "Completed",   color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelled:      { label: "Cancelled",   color: "bg-red-50 text-red-700 border-red-200",           dot: "bg-red-500" },
}

const ITEMS_PER_PAGE = 6

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 })
  const [loading, setLoading] = useState(true)

  /* Cancel modal state */
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelling, setCancelling] = useState(false)

  const CANCEL_REASONS = [
    "Changed my mind",
    "Found another service provider",
    "Booking was a mistake",
    "Schedule conflict",
    "Service no longer needed",
    "Moving to a different address",
    "Other",
  ]

  const openCancelModal = (id: string) => {
    setCancelBookingId(id)
    setCancelReason("")
    setCancelModalOpen(true)
  }

  const handleCancelBooking = async () => {
    if (!cancelBookingId || !cancelReason) return
    setCancelling(true)
    try {
      const res = await apiFetch<{ success?: boolean; message?: string }>(
        `/bookings/${cancelBookingId}/cancel`,
        {
          method: "PUT",
          body: JSON.stringify({ cancellation_reason: cancelReason }),
        }
      )
      toast.success("Booking cancelled successfully")
      setCancelModalOpen(false)
      // Refresh orders
      const data = await apiFetch<any>("/users/me/orders")
      if (data) {
        setStats(data.summary)
        setOrders(data.orders.map((o: any) => {
          const d = new Date(o.date)
          return {
            id: o.id, type: "service", title: o.service_title || "AC Service",
            description: o.technician_name ? `${o.time} · Tech: ${o.technician_name}` : o.time,
            day: String(d.getDate()).padStart(2, "0"),
            month: d.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
            year: String(d.getFullYear()),
            price: Number(o.price || 0), status: o.status,
            canTrack: o.can_track, canReview: o.can_review, hasInvoice: o.invoice_available,
          }
        }))
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking")
    } finally {
      setCancelling(false)
    }
  }

  const filters = [
    { id: "all",       label: "All" },
    { id: "services",  label: "Services" },
    { id: "products",  label: "Products" },
    { id: "cancelled", label: "Cancelled" },
  ]

  /* ── Fetch ── */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch<any>("/users/me/orders")
        if (!data) throw new Error("No data")

        setStats(data.summary)

        const mapped = data.orders.map((o: any) => {
          const d = new Date(o.date)
          const month = d.toLocaleString("en-IN", { month: "short" }).toUpperCase()
          const day   = String(d.getDate()).padStart(2, "0")
          const year  = String(d.getFullYear())

          return {
            id:           o.id,
            type:         "service",
            title:        o.service_title || "AC Service",
            description:  o.technician_name ? `${o.time} · Tech: ${o.technician_name}` : o.time,
            day, month, year,
            price:        Number(o.price || 0),
            status:       o.status,
            canTrack:     o.can_track,
            canReview:    o.can_review,
            hasInvoice:   o.invoice_available,
          }
        })

        setOrders(mapped)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => { setCurrentPage(1) }, [activeFilter])

  /* ── Filter ── */
  const filtered = orders.filter(o => {
    if (activeFilter === "all")       return true
    if (activeFilter === "services")  return o.type === "service"
    if (activeFilter === "products")  return o.type === "product"
    if (activeFilter === "cancelled") return o.status === "cancelled"
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/profile" className="hover:text-blue-600 transition-colors">My Account</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Order History</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main */}
          <div className="lg:col-span-9 space-y-6">

            {/* Header + Filters */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your bookings, track status and download invoices.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      activeFilter === f.id
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Orders",  value: stats.total,     icon: ShoppingBag,  color: "text-blue-600",   bg: "bg-blue-50" },
                { label: "Completed",     value: stats.completed,  icon: CheckCircle,  color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Upcoming",      value: stats.upcoming,   icon: Clock,        color: "text-purple-600",  bg: "bg-purple-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{String(value).padStart(2, "0")}</p>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders list */}
            {loading ? (
              <OrdersSkeletonList count={4} />
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
                <AlertCircle className="w-10 h-10 text-gray-300 mb-3" />
                <p className="font-semibold text-gray-600">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {activeFilter === "all"
                    ? "You haven't placed any bookings yet."
                    : "No orders match this filter."}
                </p>
                <Link href="/services" className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Book a Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map(order => (
                  <OrderCard key={order.id} order={order} onCancel={() => openCancelModal(order.id)} />
                ))}
              </div>
            )}

            {/* ── Cancel Booking Modal ── */}
            <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Cancel Booking
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking? Please select a reason below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Select value={cancelReason} onValueChange={setCancelReason}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue placeholder="Select cancellation reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCEL_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="rounded-xl">Keep Booking</Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelBooking}
                      disabled={!cancelReason || cancelling}
                      className="rounded-xl"
                    >
                      {cancelling ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Cancelling…</> : "Confirm Cancel"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Order Card ─── */
function OrderCard({ order, onCancel }: { order: any; onCancel: () => void }) {
  const router = useRouter()
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.open
  const isActive = ["assigned", "on_the_way", "working"].includes(order.status)
  const isCompleted = order.status === "completed" || order.status === "report_submitted"
  const isCancellable = ["open", "assigned", "on_the_way", "working"].includes(order.status)

  const handleInvoice = async () => {
    setDownloadingInvoice(true)
    try {
      const data = await apiFetch<{ invoice_url?: string; error?: string }>(
        `/payments/invoice/${order.id}`
      )
      if (!data?.invoice_url) {
        console.error("[invoice] no URL returned:", data)
        toast.error(data?.error || "Invoice not ready yet. Please try again.")
        return
      }
      console.log("[invoice] opening URL:", data.invoice_url)
      window.open(data.invoice_url, "_blank")
    } catch (err: any) {
      console.error("[invoice] download error:", err)
      toast.error(err.message || "Failed to download invoice")
    } finally {
      setDownloadingInvoice(false)
    }
  }

  const handleReview = () => {
    router.push(`/bookings/feedback?id=${order.id}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top accent for active jobs */}
      {isActive && <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />}
      {isCompleted && <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />}

      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Date badge */}
          <div className="flex-shrink-0 w-14 text-center">
            <div className="text-xs font-bold text-blue-600 uppercase">{order.month}</div>
            <div className="text-2xl font-bold text-gray-900 leading-none mt-0.5">{order.day}</div>
            <div className="text-xs text-gray-400 mt-0.5">{order.year}</div>
          </div>

          {/* Service icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCompleted ? "bg-emerald-50" : isActive ? "bg-blue-50" : "bg-gray-50"
          }`}>
            <Wrench className={`w-5 h-5 ${
              isCompleted ? "text-emerald-600" : isActive ? "text-blue-600" : "text-gray-400"
            }`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{order.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{order.description || "—"}</span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>

              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${statusCfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>

            {/* Price + Actions */}
            <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-50 flex-wrap">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-gray-700" />
                <span className="text-xl font-bold text-gray-900">
                  {Number(order.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Cancel — for active/open bookings */}
                {isCancellable && (
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 rounded-xl text-sm font-semibold transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}

                {/* Track Arrival — for active jobs */}
                {order.canTrack && (
                  <Link href={`/bookings?id=${order.id}`}>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.97]">
                      <Navigation className="w-4 h-4" />
                      Track Arrival
                    </button>
                  </Link>
                )}

                {/* Go to Completion — for completed, unpaid */}
                {!order.canTrack && !isCompleted && order.status !== "cancelled" && (
                  <Link href={`/bookings/completion?id=${order.id}`}>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200 active:scale-[0.97]">
                      <Navigation className="w-4 h-4" />
                      View Booking
                    </button>
                  </Link>
                )}

                {/* Invoice — only when completed */}
                {order.hasInvoice && (
                  <button
                    onClick={handleInvoice}
                    disabled={downloadingInvoice}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  >
                    {downloadingInvoice
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                    Invoice
                  </button>
                )}

                {/* Write Review — only when completed */}
                {order.canReview && (
                  <button
                    onClick={handleReview}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-700 hover:text-amber-700 rounded-xl text-sm font-semibold transition-all"
                  >
                    <Star className="w-4 h-4" />
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
