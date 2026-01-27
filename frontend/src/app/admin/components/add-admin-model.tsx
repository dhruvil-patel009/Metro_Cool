"use client"

import { useState } from "react"
import { X, User, Mail, Phone, Camera } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (admin: any) => void
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

/* ---------------- PHONE FORMATTER ---------------- */
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}

/* ---------------- FILE → BASE64 ---------------- */
const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })

export default function AddAdminModal({ isOpen, onClose, onAdd }: Props) {
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    email: "",
  })

  if (!isOpen) return null

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      alert("Please fill all required fields")
      return
    }

    try {
      setLoading(true)

      let profile_photo_base64: string | null = null

      if (photoFile) {
        profile_photo_base64 = await toBase64(photoFile)
      }

      const token = localStorage.getItem("accessToken")

      const res = await fetch(
        `${API_URL}/admin/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
          body: JSON.stringify({
            first_name: form.first_name,
            middle_name: form.middle_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone.replace(/\s/g, ""),
            profile_photo_base64,
          }),
        },
      )

      if (!res.ok) throw new Error("Create admin failed")

      const createdAdmin = await res.json()
      onAdd(createdAdmin)
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to create admin")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Add New Administrator</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-cyan-600 font-medium">
                <Camera className="w-4 h-4" />
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Name */}
            <div className="grid grid-cols-3 gap-3">
              <Input
                placeholder="First Name *"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
              <Input
                placeholder="Middle"
                value={form.middle_name}
                onChange={(e) =>
                  setForm({ ...form, middle_name: e.target.value })
                }
              />
              <Input
                placeholder="Last Name *"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address *"
                className="pl-10"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="123 478 5478"
                className="pl-10"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: formatPhone(e.target.value),
                  })
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3 bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
