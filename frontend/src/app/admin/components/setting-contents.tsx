"use client"

import { useEffect, useState } from "react"
import { User, Shield, Bell, Camera, Mail, Plus, MoreVertical, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog"
import AddAdminModal from "./add-admin-model"
import EditAdminModal from "./edit-admin-modal"
import { cn } from "@/app/lib/utils"

type SettingsSection = "profile" | "admin" | "notifications"

type Admin = {
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

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const getInitials = (first?: string | null, last?: string | null) => {
  const f = first?.trim()?.charAt(0) ?? ""
  const l = last?.trim()?.charAt(0) ?? ""
  return (f + l) || "A"
}

const SECTION_TABS: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Profile",        icon: User },
  { key: "admin",         label: "Admins",         icon: Shield },
  { key: "notifications", label: "Notifications",  icon: Bell },
]

export default function SettingsContent() {
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken")
    }
    return null
  }

  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [hasChanges, setHasChanges] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [profileId, setProfileId] = useState<string>("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [roleDescription, setRoleDescription] = useState("System Administrator")

  const [admins, setAdmins] = useState<Admin[]>([])
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [phone, setPhone] = useState("")

  const [notifications, setNotifications] = useState({
    newTechnicianRegistration: true,
    newBookingCreated: true,
    settlementReports: true,
    systemErrors: true,
  })

  const isCurrentAdmin = (adminId: string) => adminId === profileId

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  const fetchProfile = async () => {
    const token = getToken()
    if (!token) return
    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    setProfileId(data.id)
    setFirstName(data.first_name ?? "")
    setLastName(data.last_name ?? "")
    setEmail(data.email ?? "")
    setPhone(formatPhone(data.phone ?? ""))
    setProfilePhoto(data.profile_photo ?? null)
  }

  const fetchAdmins = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (!res.ok) { console.error("fetchAdmins failed:", res.status); return }
      const json = await res.json()
      if (!Array.isArray(json.data)) { setAdmins([]); return }
      setAdmins(
        json.data.map((a: any) => ({
          id: a.id,
          first_name: a.name?.split(" ")[0] ?? "",
          last_name: a.name?.split(" ").slice(1).join(" ") ?? "",
          name: a.name,
          email: a.email,
          phone: a.phone ?? null,
          profile_photo: a.avatar ?? null,
          role: a.role,
          active: a.status !== "inactive",
        })),
      )
    } catch (err) {
      console.error("fetchAdmins error:", err)
    }
  }

  const handleSaveChanges = async () => {
    const token = getToken()
    await fetch(`${API_URL}/admin/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone.replace(/\s/g, ""),
        profile_photo: profilePhoto,
      }),
    })
    await fetchProfile()
    await fetchAdmins()
    setHasChanges(false)
    alert("Profile updated successfully")
  }

  const toggleAdminStatus = async (adminId: string, current: boolean) => {
    if (isCurrentAdmin(adminId)) return
    const token = getToken()
    await fetch(`${API_URL}/admin/admins/${adminId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    })
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, active: !current } : a))
  }

  const openDeleteConfirm = (admin: Admin) => {
    setAdminToDelete(admin)
    setDeleteConfirmOpen(true)
  }

  const deleteAdmin = async () => {
    if (!adminToDelete) return
    try {
      setDeleteLoading(true)
      const token = getToken()
      const res = await fetch(`${API_URL}/admin/admins/${adminToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) { alert(data?.error || "Failed to delete admin"); return }
      setAdmins(prev => prev.filter(a => a.id !== adminToDelete.id))
      setDeleteConfirmOpen(false)
      setAdminToDelete(null)
    } catch (err) {
      console.error(err)
      alert("Something went wrong while deleting admin")
    } finally {
      setDeleteLoading(false)
    }
  }

  const openEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin)
    setIsEditAdminModalOpen(true)
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfilePhoto(URL.createObjectURL(file))
    setHasChanges(true)
  }

  const handleAddAdmin = async () => {
    await fetchAdmins()
  }

  const fetchNotificationPreferences = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/admin/notification-preferences`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      })
      if (!res.ok) return
      const data = await res.json()
      setNotifications({
        newTechnicianRegistration: data.new_technician_registration ?? true,
        newBookingCreated: data.new_booking_created ?? true,
        settlementReports: data.settlement_reports ?? true,
        systemErrors: data.system_errors ?? true,
      })
    } catch (err) {
      console.error("fetchNotificationPreferences error:", err)
    }
  }

  const saveNotificationPreferences = async (updated: typeof notifications) => {
    const token = getToken()
    if (!token) return
    try {
      await fetch(`${API_URL}/admin/notification-preferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_technician_registration: updated.newTechnicianRegistration,
          new_booking_created: updated.newBookingCreated,
          settlement_reports: updated.settlementReports,
          system_errors: updated.systemErrors,
        }),
      })
    } catch (err) {
      console.error("saveNotificationPreferences error:", err)
    }
  }

  const handleNotificationToggle = (key: keyof typeof notifications, checked: boolean) => {
    const updated = { ...notifications, [key]: checked }
    setNotifications(updated)
    saveNotificationPreferences(updated)
  }

  useEffect(() => {
    fetchProfile()
    fetchAdmins()
    fetchNotificationPreferences()
  }, [])

  return (
    <div className="p-5 lg:p-7 max-w-[1200px] mx-auto space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your profile, admins, and notification preferences.</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="outline" size="sm" onClick={() => setHasChanges(false)}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSaveChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
        {SECTION_TABS.map(tab => {
          const isActive = activeSection === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Profile Section ── */}
      {activeSection === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Colored header */}
          <div
            className="px-6 py-5 border-b border-gray-100"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
          >
            <h2 className="text-base font-semibold text-white">Profile Information</h2>
            <p className="text-sm text-blue-200/70 mt-0.5">Update your personal details and contact info.</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(firstName, lastName)
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePhotoInput"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                  <button
                    onClick={() => document.getElementById("profilePhotoInput")?.click()}
                    className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg shadow-lg transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setHasChanges(true) }}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setHasChanges(true) }}
                      className="h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <Input
                      value={phone}
                      onChange={(e) => { setPhone(formatPhone(e.target.value)); setHasChanges(true) }}
                      placeholder="954 458 4785"
                      className="h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setHasChanges(true) }}
                        className="pl-9 h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role Description</label>
                  <Textarea
                    value={roleDescription}
                    onChange={(e) => { setRoleDescription(e.target.value); setHasChanges(true) }}
                    className="resize-none bg-gray-50 border-gray-200 rounded-xl focus:bg-white text-gray-900"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Management Section ── */}
      {activeSection === "admin" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
          >
            <div>
              <h2 className="text-base font-semibold text-white">Administrator Accounts</h2>
              <p className="text-sm text-blue-200/70 mt-0.5">Manage system access, roles, and permissions.</p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddAdminModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Admin
            </Button>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Administrator", "Role", "Phone", "Status", "Enable", "Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {admin.profile_photo ? (
                            <img src={admin.profile_photo} alt={admin.name} className="w-full h-full object-cover" />
                          ) : (
                            getInitials(admin.first_name, admin.last_name)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{admin.first_name} {admin.last_name}</p>
                          <p className="text-xs text-gray-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{admin.phone ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                        admin.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-gray-100 text-red-600 border border-gray-200"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", admin.active ? "bg-emerald-500" : "bg-red-400")} />
                        {admin.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Switch
                        checked={admin.active}
                        disabled={admin.id === profileId}
                        onCheckedChange={() => toggleAdminStatus(admin.id, admin.active)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => openEditAdmin(admin)}>
                            Edit
                          </DropdownMenuItem>
                          {admin.id !== profileId && (
                            <DropdownMenuItem className="text-red-600" onSelect={() => openDeleteConfirm(admin)}>
                              Remove
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {admin.profile_photo ? (
                        <img src={admin.profile_photo} alt={admin.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(admin.first_name, admin.last_name)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{admin.first_name} {admin.last_name}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => openEditAdmin(admin)}>
                        Edit
                      </DropdownMenuItem>
                      {admin.id !== profileId && (
                        <DropdownMenuItem className="text-red-600" onSelect={() => openDeleteConfirm(admin)}>
                          Remove
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Role</p>
                    <p className="text-blue-700 font-medium capitalize mt-0.5">{admin.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Status</p>
                    <span className={cn(
                      "inline-flex items-center gap-1 mt-0.5 text-xs font-semibold",
                      admin.active ? "text-emerald-700" : "text-red-600"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", admin.active ? "bg-emerald-500" : "bg-red-400")} />
                      {admin.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-sm text-gray-500">Enable Account</span>
                  <Switch
                    checked={admin.active}
                    disabled={admin.id === profileId}
                    onCheckedChange={() => toggleAdminStatus(admin.id, admin.active)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notifications Section ── */}
      {activeSection === "notifications" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 border-b border-gray-100"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
          >
            <h2 className="text-base font-semibold text-white">Notification Preferences</h2>
            <p className="text-sm text-blue-200/70 mt-0.5">Choose which events you want to be notified about.</p>
          </div>

          <div className="divide-y divide-gray-50">
            {[
              {
                key: "newTechnicianRegistration" as const,
                title: "New Technician Registration",
                desc: "Get notified when a new technician signs up for approval.",
                accent: "#6366f1",
                accentLight: "#eef2ff",
              },
              {
                key: "newBookingCreated" as const,
                title: "New Booking Created",
                desc: "Receive an alert for every new service booking.",
                accent: "#3b82f6",
                accentLight: "#eff6ff",
              },
              {
                key: "settlementReports" as const,
                title: "Settlement Reports",
                desc: "Weekly summary of payouts and commissions.",
                accent: "#f59e0b",
                accentLight: "#fffbeb",
              },
              {
                key: "systemErrors" as const,
                title: "System Errors",
                desc: "Get alerted when critical system errors occur.",
                accent: "#ef4444",
                accentLight: "#fef2f2",
              },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: item.accentLight }}
                  >
                    <Bell className="w-4 h-4" style={{ color: item.accent }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) => handleNotificationToggle(item.key, checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 flex-shrink-0 mt-0.5"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Admin Modal ── */}
      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onAdd={handleAddAdmin}
      />

      {/* ── Edit Admin Modal ── */}
      <EditAdminModal
        isOpen={isEditAdminModalOpen}
        admin={editingAdmin}
        onClose={() => { setIsEditAdminModalOpen(false); setEditingAdmin(null) }}
        onUpdated={fetchAdmins}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={(open) => { if (!open) { setDeleteConfirmOpen(false); setAdminToDelete(null) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Delete Admin Account</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {adminToDelete?.first_name} {adminToDelete?.last_name}
              </span>
              &apos;s admin account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => { setDeleteConfirmOpen(false); setAdminToDelete(null) }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={deleteAdmin}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
