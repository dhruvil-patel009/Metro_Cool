"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "react-toastify"
import { ChevronRight, Camera, CheckCircle2, Phone, Trash2, User } from "lucide-react"
import { ProfileSidebar } from "../components/profile-sidebar"
import { apiFetch } from "@/app/lib/api"
import { UserMeResponse } from "../types/user"

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<UserMeResponse>("/user/me")
        setFirstName(data.first_name ?? "")
        setLastName(data.last_name ?? "")
        setPhone(formatPhoneNumber(data.phone ?? ""))
        setProfileImage(
          typeof data.profile_photo === "string" && data.profile_photo.length > 0
            ? data.profile_photo : ""
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
    const digits = value.replace(/\D/g, "").slice(0, 10)
    const p1 = digits.slice(0, 3), p2 = digits.slice(3, 6), p3 = digits.slice(6, 10)
    if (digits.length > 6) return `${p1} ${p2} ${p3}`
    if (digits.length > 3) return `${p1} ${p2}`
    return p1
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhone(formatPhoneNumber(e.target.value))

  const handleSaveChanges = async () => {
    const rawPhone = phone.replace(/\s/g, "")
    if (rawPhone.length !== 10) { toast.error("Phone number must be 10 digits"); return }
    setSaving(true)
    try {
      await apiFetch("/user/me", {
        method: "PUT",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: rawPhone,
          profile_photo: profileImage || null,
        }),
      })
      toast.success("Profile updated successfully")
      localStorage.setItem("profile-cache", JSON.stringify({
        first_name: firstName, last_name: lastName, profile_photo: profileImage,
      }))
      window.dispatchEvent(new Event("profile-updated"))
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return }
    if (file.size > 3 * 1024 * 1024) { toast.error("Image must be less than 3MB"); return }
    const reader = new FileReader()
    reader.onloadend = () => setProfileImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3">
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="w-12 h-12 bg-gray-100 rounded-xl mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
                {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl" />)}
              </div>
            </div>
            <div className="lg:col-span-9">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-11 bg-gray-50 rounded-xl" />
                  <div className="h-11 bg-gray-50 rounded-xl" />
                  <div className="sm:col-span-2 h-11 bg-gray-50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
          <span className="text-gray-900 font-medium">Profile</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main */}
          <div className="lg:col-span-9 space-y-5">

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Profile Information</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage your personal details and account settings.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[11px] font-bold self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  VERIFIED
                </span>
              </div>

              <div className="p-5 sm:p-6">

                {/* Avatar row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pb-6 mb-6 border-b border-gray-100">
                  <div className="relative self-start sm:self-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm">
                      {profileImage ? (
                        <img key={profileImage} src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <label className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white">
                      <Camera className="w-3.5 h-3.5 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{firstName} {lastName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tap the camera icon to update your photo</p>
                    <p className="text-xs text-gray-400 mt-0.5">Max 3 MB · JPG, PNG, WEBP</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        First Name
                      </label>
                      <input
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Last Name
                      </label>
                      <input
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400 font-medium">+91</span>
                        <span className="w-px h-4 bg-gray-200" />
                      </div>
                      <input
                        value={phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        maxLength={12}
                        placeholder="99249 87099"
                        className="w-full pl-20 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
                  <button className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors py-2.5 sm:py-0">
                    <Trash2 className="w-4 h-4" />
                    Deactivate Account
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
