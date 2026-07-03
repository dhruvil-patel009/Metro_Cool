"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "react-toastify"
import {
  ChevronRight,
  Camera,
  CheckCircle2,
  Phone,
  Trash2,
  User,
} from "lucide-react"
import { ProfileSidebar } from "../components/profile-sidebar"
import { apiFetch } from "@/app/lib/api"
import { UserMeResponse } from "../types/user"

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<UserMeResponse>("/user/me")
        setFirstName(data.first_name ?? "")
        setLastName(data.last_name ?? "")
        setPhone(formatPhoneNumber(data.phone ?? ""))
        setProfileImage(
          typeof data.profile_photo === "string" && data.profile_photo.length > 0
            ? data.profile_photo
            : ""
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
    const part1 = digits.slice(0, 3)
    const part2 = digits.slice(3, 6)
    const part3 = digits.slice(6, 10)
    if (digits.length > 6) return `${part1} ${part2} ${part3}`
    if (digits.length > 3) return `${part1} ${part2}`
    return part1
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const handleSaveChanges = async () => {
    try {
      const rawPhone = phone.replace(/\s/g, "")
      if (rawPhone.length !== 10) {
        toast.error("Phone number must be 10 digits")
        return
      }

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
      localStorage.setItem(
        "profile-cache",
        JSON.stringify({ first_name: firstName, last_name: lastName, profile_photo: profileImage })
      )
      window.dispatchEvent(new Event("profile-updated"))
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be less than 3MB")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setProfileImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-full mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-50 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-9">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-100 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-50 rounded-xl" />
                  <div className="h-12 bg-gray-50 rounded-xl" />
                  <div className="sm:col-span-2 h-12 bg-gray-50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">My Account</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1d242d]">
                      Profile Information
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your personal details and account settings.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[11px] font-bold shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                      {profileImage ? (
                        <img
                          key={profileImage}
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors border-2 border-white">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d242d]">
                      {firstName} {lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Click the camera icon to update your photo
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        First Name
                      </label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Last Name
                      </label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        maxLength={12}
                        placeholder="992 489 7138"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Deactivate Account
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                  >
                    Save Changes
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
