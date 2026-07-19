"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ChevronRight, Plus, MapPin, Home, Briefcase,
  Trash2, Edit2, Star, User, Phone,
} from "lucide-react"
import { cn } from "@/app/lib/utils"
import { ProfileSidebar } from "../../components/profile-sidebar"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return
      try {
        const res = await fetch(`${API_URL}/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
        setAddresses(data.addresses)
      } catch (err) {
        console.error("Failed to load addresses", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken")
    if (!token || !confirm("Delete this address?")) return
    try {
      await fetch(`${API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch {
      alert("Failed to delete address")
    }
  }

  const handleSetDefault = async (id: string) => {
    const token = localStorage.getItem("accessToken")
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/addresses/${id}/default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === data.address.id })))
    } catch {
      alert("Failed to set default")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/profile" className="hover:text-blue-600 transition-colors">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium">Saved Addresses</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main */}
          <div className="lg:col-span-9 space-y-5">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Saved Addresses</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage your shipping and billing locations for faster checkout.
                </p>
              </div>
              <Link
                href="/addresses/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add New Address
              </Link>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-gray-100 rounded w-1/3" />
                        <div className="h-3 bg-gray-50 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-10 bg-gray-50 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const formattedAddress = [
                    addr.street,
                    addr.apartment,
                    addr.city,
                    addr.state,
                    addr.postal_code,
                  ].filter(Boolean).join(", ")

                  const Icon = addr.label === "Office" ? Briefcase : Home
                  const iconBg = addr.label === "Office"
                    ? "bg-purple-50 text-purple-600"
                    : addr.is_default
                    ? "bg-blue-50 text-blue-600"
                    : "bg-orange-50 text-orange-600"

                  return (
                    <div
                      key={addr.id}
                      className={cn(
                        "bg-white rounded-2xl border p-4 sm:p-5 flex flex-col gap-4 transition-all hover:shadow-md",
                        addr.is_default
                          ? "border-blue-200 shadow-sm"
                          : "border-gray-100"
                      )}
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-gray-900">{addr.label}</span>
                              {addr.is_default && (
                                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">Saved Address</p>
                          </div>
                        </div>
                        {addr.is_default ? (
                          <Star className="w-4 h-4 fill-blue-600 text-blue-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="text-[11px] text-gray-400 hover:text-blue-600 font-medium transition-colors flex-shrink-0"
                          >
                            Set default
                          </button>
                        )}
                      </div>

                      {/* Address details */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5 text-sm">
                          <User className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="font-semibold text-gray-800 text-xs">{addr.full_name}</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500 text-xs leading-relaxed">{formattedAddress}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-500 text-xs">{addr.phone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                        <Link
                          href={`/addresses/${addr.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-all flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Add new card */}
                <Link
                  href="/addresses/new"
                  className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center text-center p-6 gap-3 min-h-[180px] group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Add New Address</p>
                    <p className="text-xs text-gray-400 mt-0.5">New shipping or billing location</p>
                  </div>
                </Link>

                {addresses.length === 0 && (
                  <div className="sm:col-span-2 text-center py-12 text-gray-400">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium">No saved addresses yet</p>
                    <p className="text-xs mt-1">Add an address to speed up checkout</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
