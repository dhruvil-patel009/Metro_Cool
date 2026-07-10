"use client"

import { useState, useEffect } from "react"
import {
  Settings, Pencil, Check, X, Loader2, Search,
  IndianRupee, Percent, Info
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select"
import { toast } from "react-toastify"

interface ServiceCommission {
  id: string
  title: string
  category: string
  price: number
  commission_type: "percentage" | "flat"
  commission_value: number
  is_active: boolean
}

const formatINR = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v)

export default function CommissionSettingsPage() {
  const [services, setServices] = useState<ServiceCommission[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState<"percentage" | "flat">("percentage")
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!
  const token = () => localStorage.getItem("accessToken")

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API}/services/admin`, {
        headers: { Authorization: `Bearer ${token()}` },
      })
      const data = await res.json()
      setServices(data || [])
    } catch {
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const startEdit = (service: ServiceCommission) => {
    setEditingId(service.id)
    setEditType(service.commission_type || "percentage")
    setEditValue((service.commission_value ?? 20).toString())
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const saveCommission = async (serviceId: string) => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({
          commission_type: editType,
          commission_value: Number(editValue),
        }),
      })
      if (!res.ok) throw new Error()

      setServices(prev =>
        prev.map(s =>
          s.id === serviceId
            ? { ...s, commission_type: editType, commission_value: Number(editValue) }
            : s
        )
      )
      setEditingId(null)
      toast.success("Commission updated successfully")
    } catch {
      toast.error("Failed to update commission")
    } finally {
      setSaving(false)
    }
  }

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const avgCommission = services.length
    ? (services.reduce((a, s) => a + (s.commission_value ?? 20), 0) / services.length).toFixed(1)
    : "0"
  const activeCount = services.filter(s => s.is_active).length

  if (loading) {
    return (
      <div className="p-5 lg:p-7 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 lg:p-7 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Service Commission Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure commission rates for each service. Changes apply to new settlements instantly.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-500 font-medium">Total Services</p>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{services.length}</p>
          <p className="text-xs text-gray-400 mt-1">{activeCount} active</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-500 font-medium">Avg. Commission</p>
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Percent className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgCommission}%</p>
          <p className="text-xs text-gray-400 mt-1">Across all services</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-gray-500 font-medium">Commission Model</p>
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <IndianRupee className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">Per-Service</p>
          <p className="text-xs text-gray-400 mt-1">Configurable per service</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">How commission works</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Commission is deducted from technician payment during settlement. For example, a 10% commission on a ₹2,000 service means Admin receives ₹200 and Technician receives ₹1,800.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="pl-9 h-10 border-gray-200 bg-gray-50"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Service Name</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Commission Type</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Commission</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Earning</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Tech Earning</th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredServices.map(service => {
                const isEditing = editingId === service.id
                const commType = isEditing ? editType : (service.commission_type || "percentage")
                const commVal = isEditing ? Number(editValue) || 0 : (service.commission_value ?? 20)
                const adminEarning = commType === "percentage"
                  ? Math.round(service.price * (commVal / 100))
                  : Math.min(commVal, service.price)
                const techEarning = service.price - adminEarning

                return (
                  <tr key={service.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                          {service.title.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 whitespace-nowrap">{service.title}</p>
                          {!service.is_active && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inactive</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">{formatINR(service.price)}</td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <Select value={editType} onValueChange={(v) => setEditType(v as "percentage" | "flat")}>
                          <SelectTrigger className="h-9 w-[130px] text-xs border-gray-300 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="flat">Flat (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-gray-600 capitalize">{commType}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          max={editType === "percentage" ? "100" : undefined}
                          step="0.5"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-9 w-20 text-sm border-gray-300"
                          autoFocus
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {commType === "percentage" ? `${commVal}%` : formatINR(commVal)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-green-600">{formatINR(adminEarning)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-blue-600">{formatINR(techEarning)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            onClick={() => saveCommission(service.id)}
                            disabled={saving}
                          >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={cancelEdit}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => startEdit(service)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredServices.map(service => {
            const isEditing = editingId === service.id
            const commType = isEditing ? editType : (service.commission_type || "percentage")
            const commVal = isEditing ? Number(editValue) || 0 : (service.commission_value ?? 20)
            const adminEarning = commType === "percentage"
              ? Math.round(service.price * (commVal / 100))
              : Math.min(commVal, service.price)
            const techEarning = service.price - adminEarning

            return (
              <div key={service.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                      {service.title.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{service.title}</p>
                      <p className="text-xs text-gray-400">{service.category} &middot; {formatINR(service.price)}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      onClick={() => startEdit(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
                        <Select value={editType} onValueChange={(v) => setEditType(v as "percentage" | "flat")}>
                          <SelectTrigger className="h-9 text-xs border-gray-300 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="flat">Flat (₹)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Value</label>
                        <Input
                          type="number"
                          min="0"
                          max={editType === "percentage" ? "100" : undefined}
                          step="0.5"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-9 text-sm border-gray-300"
                        />
                      </div>
                    </div>
                    {/* Live Preview */}
                    <div className="rounded-lg border-l-4 border-blue-500 bg-white p-3">
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Preview</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Admin: <span className="font-bold text-green-600">{formatINR(adminEarning)}</span></span>
                        <span>Tech: <span className="font-bold text-blue-600">{formatINR(techEarning)}</span></span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => saveCommission(service.id)}
                        disabled={saving}
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}
                        Save
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={cancelEdit}>
                        <X className="w-4 h-4 mr-1.5" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 text-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Commission</p>
                      <p className="text-sm font-bold text-purple-700">
                        {commType === "percentage" ? `${commVal}%` : formatINR(commVal)}
                      </p>
                    </div>
                    <div className="border-x border-gray-200">
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Admin</p>
                      <p className="text-sm font-bold text-green-600">{formatINR(adminEarning)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Technician</p>
                      <p className="text-sm font-bold text-blue-600">{formatINR(techEarning)}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty */}
        {filteredServices.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">No services found matching &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )
}
