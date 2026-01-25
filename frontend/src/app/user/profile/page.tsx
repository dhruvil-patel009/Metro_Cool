"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  ChevronRight,
  Camera,
  CheckCircle2,
  Phone,
  Mail,
  Trash2,
} from "lucide-react"
import { ProfileSidebar } from "../components/profile-sidebar"

/* ================= API CONFIG ================= */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error("API base URL missing")

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") ||
      localStorage.getItem("token")
      : null

  const res = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || err.message || "Unauthorized")
  }

  return res.json()
}


export default function ProfilePage() {
  /* ================= STATE (NO DUMMY DATA) ================= */
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [loading, setLoading] = useState(true)

  /* ================= FETCH CURRENT USER ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest<any>("/user/me")

        // 🔥 REAL DATA FROM SUPABASE
        setFirstName(data.first_name ?? "")
        setLastName(data.last_name ?? "")
        setPhone(formatPhoneNumber(data.phone ?? ""))
        setProfileImage(
          typeof data.profile_photo === "string" && data.profile_photo.length > 0
            ? data.profile_photo
            : "/placeholder.svg"
        )
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])


  const formatPhoneNumber = (value: string) => {
    // remove non-digits
    const digits = value.replace(/\D/g, "").slice(0, 10)

    const part1 = digits.slice(0, 3)
    const part2 = digits.slice(3, 6)
    const part3 = digits.slice(6, 10)

    if (digits.length > 6) return `${part1} ${part2} ${part3}`
    if (digits.length > 3) return `${part1} ${part2}`
    return part1
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  /* ================= UPDATE USER (OPTIONAL) ================= */
  const handleSaveChanges = async () => {
    try {
      const rawPhone = phone.replace(/\s/g, "") // remove spaces

      if (rawPhone.length !== 10) {
        toast.error("Phone number must be 10 digits")
        return
      }

      await apiRequest("/user/me", {
        method: "PUT",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: rawPhone,
          profile_photo: profileImage || null,
        }),
      })

      toast.success("Profile updated successfully")
      localStorage.setItem(
  "profile-cache",
  JSON.stringify({
    first_name: firstName,
    last_name: lastName,
    profile_photo: profileImage,
  })
)

window.dispatchEvent(new Event("profile-updated"))
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    }
  }



  /* ================= IMAGE PREVIEW ================= */
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // optional validation
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file")
    return
  }

  if (file.size > 3 * 1024 * 1024) {
    toast.error("Image must be less than 3MB")
    return
  }

  const reader = new FileReader()
  reader.onloadend = () => {
    setProfileImage(reader.result as string) // ✅ THIS WAS MISSING
  }
  reader.readAsDataURL(file)
}


  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Profile Information
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your personal details. Your account is secured via
                    phone number verification (OTP).
                  </p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Personal Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Information used for service bookings and communication.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    VERIFIED ACCOUNT
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Image */}
                  <div className="md:col-span-2 flex items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm overflow-hidden">
                          <img
  key={profileImage}
  src={profileImage || "/placeholder.svg"}
  alt="Profile"
  className="w-full h-full object-cover"
/>
                        </div>
                      </div>
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      First Name
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>



                  {/* Phone */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        value={phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        maxLength={12}
                        placeholder="992 489 7138"
                        className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button className="flex items-center gap-2 text-sm text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Deactivate Account
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
