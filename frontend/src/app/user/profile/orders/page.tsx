"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Clock,
  CheckCircle,
  Package,
  Wrench,
  ShoppingBag,
  XCircle,
  ChevronLeft,
} from "lucide-react"
import { ProfileSidebar } from "../../components/profile-sidebar"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
  })
  const [loading, setLoading] = useState(true)
  const ITEMS_PER_PAGE = 5

  const filters = [
    { id: "all", label: "All" },
    { id: "services", label: "Services" },
    { id: "products", label: "Products" },
    { id: "cancelled", label: "Cancelled" },
  ]

  /* ================= FETCH ORDER HISTORY ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return

      try {
        const res = await fetch(`${API_URL}/users/me/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message)

        setStats(data.summary)

        /* 🔥 MAP API → UI SHAPE (NO UI CHANGE) */
const mappedOrders = data.orders.map((o: any) => {

  /* ---------- STATUS NORMALIZATION ---------- */
  let uiStatus = "upcoming"
  let statusLabel = "Technician Assigned"

  if (o.status === "completed") {
    uiStatus = "completed"
    statusLabel = "Service Completed"
  }
  else if (o.status === "cancelled") {
    uiStatus = "cancelled"
    statusLabel = "Cancelled"
  }
  else if (["assigned", "on_the_way", "working", "open"].includes(o.status)) {
    uiStatus = "upcoming"
    statusLabel = "Technician Assigned"
  }

  /* ---------- DATE FORMAT (FOR BLUE CALENDAR BADGE) ---------- */
/* ---------- DATE FORMAT ---------- */
const d = new Date(o.date)

const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
const day = String(d.getDate()).padStart(2, "0")
const year = d.getFullYear()

const fullDateText = d.toLocaleDateString("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
})

  return {
    id: o.id,
    type: "service",
    title: o.service_title,

    description: o.technician_name
      ? `${o.time} • Technician: ${o.technician_name}`
      : o.time,

     /* 👇 IMPORTANT FIELDS FOR UI */
  date: `${month} ${day}`,
  day,
  month,
  year: String(year),
  fullDate: fullDateText,

    price: `$${Number(o.price).toFixed(2)}`,

    status: uiStatus,
    statusLabel,

    icon: "snowflake",

    tag: uiStatus === "upcoming" ? "UPCOMING SERVICE" : null,

    actions: [
      ...(o.can_track ? ["track", "reschedule"] : []),
      ...(o.invoice_available ? ["invoice"] : []),
      ...(o.can_review ? ["review"] : []),
    ],
  }
})

        setOrders(mappedOrders)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
  setCurrentPage(1)
}, [activeFilter])

/* ================= FILTER ================= */
const filteredOrders = orders.filter((order) => {
  if (activeFilter === "all") return true
  if (activeFilter === "services") return order.type === "service"
  if (activeFilter === "products") return order.type === "product"
  if (activeFilter === "cancelled") return order.status === "cancelled"
  return true
})

/* ================= PAGINATION ================= */
const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
const paginatedOrders = filteredOrders.slice(
  startIndex,
  startIndex + ITEMS_PER_PAGE
)

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/user" className="hover:text-blue-600  transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/user/profile" className="hover:text-blue-600  transition-colors">
            My Account
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main */}
          <div className="lg:col-span-9">
            <div className="mb-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order History</h1>
                  <p className="text-gray-600">
                    Manage your bookings, track status and download invoices.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.id
                          ? "bg-gray-900 text-white"
                          : "bg-white border text-gray-700 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
<div className="grid grid-cols-3 gap-4 mb-8">
  <StatCard variant="total" label="TOTAL ORDERS" value={stats.total} icon={ShoppingBag} />
  <StatCard variant="completed" label="COMPLETED" value={stats.completed} icon={CheckCircle} />
  <StatCard variant="upcoming" label="UPCOMING" value={stats.upcoming} icon={Clock} />
</div>

              {/* Orders */}
              <div className="space-y-4">
{paginatedOrders.map((order) => (
  <OrderCard key={order.id} order={order} />
))}
              </div>
              {/* ================= PAGINATION ================= */}
{totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-8">

    {/* Prev */}
    <button
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    {/* Page Numbers */}
    {Array.from({ length: totalPages }).map((_, i) => {
      const page = i + 1
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      )
    })}

    {/* Next */}
    <button
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
    >
      <ChevronRight className="w-5 h-5" />
    </button>

  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= SMALL UI HELPERS (NO STYLE CHANGE) ================= */

function StatCard({ label, value, icon: Icon, variant }: any) {

  /* ---------- COLOR MAP ---------- */
  const styles: Record<string, any> = {
    total: {
      wrapper: "bg-white border border-gray-100",
      iconBox: "bg-blue-50",
      iconColor: "text-blue-600",
      number: "text-gray-900",
    },
    completed: {
      wrapper: "bg-white border border-gray-100",
      iconBox: "bg-green-50",
      iconColor: "text-green-600",
      number: "text-gray-900",
    },
    upcoming: {
      wrapper: "bg-white border border-gray-100",
      iconBox: "bg-purple-50",
      iconColor: "text-purple-600",
      number: "text-gray-900",
    },
  }

  const s = styles[variant] || styles.total

  return (
    <div className={`rounded-xl p-4 ${s.wrapper}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.iconBox}`}>
          <Icon className={`w-5 h-5 ${s.iconColor}`} />
        </div>

        <div>
          <div className={`text-2xl font-bold ${s.number}`}>
            {String(value).padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order }: any) {
  return (
    <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">

        {/* 🔥 DATE BADGE (calendar style) */}
        {order.year && (
          <div className="flex-shrink-0 text-center">
            <div className="text-xs font-medium text-blue-600 mb-1">
              {order.month}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {order.day}
            </div>
            <div className="text-xs text-gray-500">
              {order.year}
            </div>
          </div>
        )}

        {/* Icon */}
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Wrench className="w-6 h-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          {order.tag && (
            <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs rounded mb-2">
              {order.tag}
            </span>
          )}

          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{order.title}</h3>
            <span className="text-xs text-gray-500">Order #{order.id.slice(0,8)}</span>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {order.description}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="font-bold text-xl">{order.price}</span>

            <div className="flex gap-2">
              {/* {order.actions.includes("reschedule") && (
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Reschedule
                </button>
              )} */}

              {/* {order.actions.includes("track") && ( */}
                <Link
               href={`/user/bookings?id=${order.id}`}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 cursor-pointer"
              >
                <button>
                  Track Arrival
                </button>
                </Link>
               {/* )} */}

              {order.actions.includes("invoice") && (
                <button className="px-4 py-2 text-sm">Invoice</button>
              )}

              {order.actions.includes("review") && (
                <button className="px-4 py-2 text-sm">Write Review</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}