"use client"

import { useState, useEffect } from "react"
import { X, User, Mail, Phone } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

interface Admin {
  id: string
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  profile_photo: string | null
  role: string
  active: boolean
}

interface Props {
  isOpen: boolean
  admin: Admin | null
  onClose: () => void
  onUpdated: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

export default function EditAdminModal({ isOpen, admin, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    if (admin) {
      setForm({
        first_name: admin.first_name || "",
        last_name: admin.last_name || "",
        phone: formatPhone(admin.phone || ""),
        email: admin.email || "",
      })
    }
  }, [admin])

  if (!isOpen || !admin) return null

  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      alert("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API_URL}/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone.replace(/\s/g, ""),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || "Failed to update admin")
      }

      await onUpdated()
      onClose()
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Failed to update admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Edit Administrator</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {admin.profile_photo ? (
                  <img src={admin.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {admin.first_name} {admin.last_name}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  First Name *
                </label>
                <Input
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Last Name *
                </label>
                <Input
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="123 478 5478"
                  className="pl-10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
