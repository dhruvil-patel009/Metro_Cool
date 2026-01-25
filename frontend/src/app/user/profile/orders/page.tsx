"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Clock, CheckCircle, Package, Wrench, ShoppingBag, XCircle, ChevronLeft } from "lucide-react"
import { ProfileSidebar } from "../../components/profile-sidebar"

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filters = [
    { id: "all", label: "All" },
    { id: "services", label: "Services" },
    { id: "products", label: "Products" },
    { id: "cancelled", label: "Cancelled" },
  ]

  // Sample order data
  const orders = [
    {
      id: "ORD-UPC-992",
      type: "service",
      title: "Full Home Deep Clean",
      description: "10:00 AM - 02:00 PM • Technician: Mike R.",
      date: "NOV 02",
      year: "2023",
      fullDate: "Nov 02, 2023",
      price: "$150.00",
      status: "upcoming",
      statusLabel: "Technician Assigned",
      icon: "snowflake",
      tag: "UPCOMING SERVICE",
      actions: ["reschedule", "track"],
    },
    {
      id: "ORD-2839",
      type: "service",
      title: "AC Repair & Service",
      description: "Professional deep cleaning and gas refill.",
      date: "Oct 26, 2023",
      price: "$45.00",
      status: "completed",
      statusLabel: "Service Completed",
      icon: "snowflake",
      actions: ["invoice", "review"],
    },
    {
      id: "ORD-2910",
      type: "product",
      title: "Smart Thermostat (Gen 3)",
      description: "Product Purchase • Quantity: 1",
      date: "Oct 10, 2023",
      price: "$120.00",
      status: "delivered",
      statusLabel: "Delivered on Oct 12",
      icon: "thermostat",
      actions: ["buyAgain", "details"],
    },
    {
      id: "ORD-2766",
      type: "service",
      title: "Annual Plumbing Checkup",
      description: "Routine maintenance check.",
      date: "Sep 15, 2023",
      price: "$85.00",
      originalPrice: "$85.00",
      status: "cancelled",
      statusLabel: "Cancelled",
      icon: "wrench",
      actions: ["details"],
    },
  ]

  const stats = {
    total: 12,
    completed: 8,
    upcoming: 1,
  }

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true
    if (activeFilter === "services") return order.type === "service"
    if (activeFilter === "products") return order.type === "product"
    if (activeFilter === "cancelled") return order.status === "cancelled"
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/user" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/user/profile" className="hover:text-blue-600 transition-colors">
            My Account
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="mb-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
                  <p className="text-gray-600">Manage your bookings, track status and download invoices.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mt-4 md:mt-0">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeFilter === filter.id
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                      <div className="text-sm text-gray-600">TOTAL ORDERS</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{String(stats.completed).padStart(2, "0")}</div>
                      <div className="text-sm text-gray-600">COMPLETED</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{String(stats.upcoming).padStart(2, "0")}</div>
                      <div className="text-sm text-gray-600">UPCOMING</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge (for upcoming orders) */}
                      {order.year && (
                        <div className="flex-shrink-0 text-center">
                          <div className="text-xs font-medium text-blue-600 mb-1">{order.date.split(" ")[0]}</div>
                          <div className="text-2xl font-bold text-gray-900">{order.date.split(" ")[1]}</div>
                          <div className="text-xs text-gray-500">{order.year}</div>
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          order.icon === "snowflake"
                            ? "bg-blue-50"
                            : order.icon === "thermostat"
                              ? "bg-orange-50"
                              : "bg-gray-100"
                        }`}
                      >
                        {order.icon === "snowflake" && <Wrench className="w-6 h-6 text-blue-600" />}
                        {order.icon === "thermostat" && <Package className="w-6 h-6 text-orange-600" />}
                        {order.icon === "wrench" && <Wrench className="w-6 h-6 text-gray-600" />}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {order.tag && (
                              <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded mb-2">
                                {order.tag}
                              </span>
                            )}
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                              <span className="text-xs text-gray-500">Order #{order.id}</span>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              {order.description.includes("•") ? (
                                <>
                                  <Clock className="w-4 h-4" />
                                  {order.description}
                                </>
                              ) : (
                                order.description
                              )}
                            </p>
                            {!order.year && (
                              <p className="text-xs text-gray-500 mt-1">
                                #{order.id} • {order.date}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div
                              className={`text-xl font-bold ${order.status === "cancelled" ? "text-gray-400 line-through" : "text-gray-900"}`}
                            >
                              {order.price}
                            </div>
                            {order.status === "upcoming" && (
                              <p className="text-xs text-gray-500 mt-1">Paid via UPI ending x1042</p>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            {order.status === "upcoming" && (
                              <>
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">{order.statusLabel}</span>
                              </>
                            )}
                            {order.status === "completed" && (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">{order.statusLabel}</span>
                              </>
                            )}
                            {order.status === "delivered" && (
                              <>
                                <Package className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">{order.statusLabel}</span>
                              </>
                            )}
                            {order.status === "cancelled" && (
                              <>
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-600">{order.statusLabel}</span>
                              </>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {order.actions.includes("reschedule") && (
                              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                Reschedule
                              </button>
                            )}
                            {order.actions.includes("track") && (
                              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Track Arrival
                              </button>
                            )}
                            {order.actions.includes("invoice") && (
                              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                Invoice
                              </button>
                            )}
                            {order.actions.includes("review") && (
                              <button className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                Write Review
                              </button>
                            )}
                            {order.actions.includes("buyAgain") && (
                              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                Buy Again
                              </button>
                            )}
                            {order.actions.includes("details") && (
                              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={currentPage === 3}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
