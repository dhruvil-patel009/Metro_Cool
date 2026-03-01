"use client"

import { useEffect, useState } from "react"
import { User, Shield, Bell, Camera, Mail, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import AddAdminModal from "./add-admin-model"

type SettingsSection = "profile" | "admin" | "notifications"

type Admin = {
  id: string
  first_name: string
  last_name: string
  name:string
  email: string
  phone: string | null
  profile_photo: string | null
  role: string
  active: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const getInitials = (
  first?: string | null,
  last?: string | null,
) => {
  const f = first?.trim()?.charAt(0) ?? ""
  const l = last?.trim()?.charAt(0) ?? ""
  return (f + l) || "A"
}

export default function SettingsContent() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null

  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [hasChanges, setHasChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
  const [profileId, setProfileId] = useState<string>("")

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [roleDescription, setRoleDescription] = useState("System Administrator")

  const [admins, setAdmins] = useState<Admin[]>([])
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)



  

  const [notifications, setNotifications] = useState({
    newTechnicianRegistration: true,
    newBookingCreated: false,
    settlementReports: true,
    systemErrors: true,
  })



  const handleCancel = () => {
    setHasChanges(false)
  }


  const handleAddAdmin = (newAdmin: any) => {
    setAdmins([...admins, newAdmin])
    setHasChanges(true)
  }

    /* ================= HELPERS ================= */

  const isCurrentAdmin = (adminId: string) =>
    adminId === profileId

  const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10)

  if (digits.length <= 3) return digits
  if (digits.length <= 6)
    return `${digits.slice(0, 3)} ${digits.slice(3)}`
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}


  /* ---------------- FETCH PROFILE ---------------- */

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // ✅ FIX
    })

    const data = await res.json()

    setProfileId(data.id)
    setFirstName(data.first_name ?? "")
    setLastName(data.last_name ?? "")
    setEmail(data.email ?? "")
    setPhone(formatPhone(data.phone ?? ""))
    setProfilePhoto(data.profile_photo ?? null)
  }

  /* ---------------- FETCH ADMINS ---------------- */

  const fetchAdmins = async () => {
    const res = await fetch(`${API_URL}/admin/admins`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store", // ✅ FIX
    })

    const json = await res.json()

    if (!Array.isArray(json.data)) {
      setAdmins([])
      return
    }

    setAdmins(
      json.data.map((a: any) => ({
        id: a.id,
        first_name: a.name?.split(" ")[0] ?? "",
        last_name: a.name?.split(" ").slice(1).join(" ") ?? "",
        email: a.email,
        phone: a.phone ?? null,
        profile_photo: a.avatar ?? null,
        role: a.role,
        active: a.status !== "inactive",
      })),
    )
  }



  /* ================= UPDATE PROFILE ================= */

const handleSaveChanges = async () => {


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
      profile_photo: profilePhoto, // ✅ CORRECT
    }),
    
  })
 await fetchProfile() // ✅ REFRESH DATA
    await fetchAdmins()
  setHasChanges(false)
  alert("Profile updated successfully")
}


  /* ================= TOGGLE ADMIN STATUS ================= */

  const toggleAdminStatus = async (
    adminId: string,
    current: boolean,
  ) => {
    if (isCurrentAdmin(adminId)) return

    await fetch(`${API_URL}/admin/admins/${adminId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: !current }),
    })

    setAdmins((prev) =>
      prev.map((a) =>
        a.id === adminId
          ? { ...a, active: !current }
          : a,
      ),
    )
  }

  /* ================= DELETE ADMIN ================= */

const deleteAdmin = async (adminId: string) => {
  try {
    if (isCurrentAdmin(adminId)) return

    if (!confirm("Are you sure you want to remove this admin?"))
      return

    const res = await fetch(`${API_URL}/admin/admins/${adminId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data?.error || "Failed to delete admin")
      return
    }

    // ✅ remove locally
    setAdmins(prev => prev.filter(a => a.id !== adminId))

    // ⭐ VERY IMPORTANT — sync with database
    await fetchAdmins()

    alert("Admin removed successfully")

  } catch (err) {
    console.error(err)
    alert("Something went wrong while deleting admin")
  }
}

const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setPhotoFile(file) // ✅ SAVE FILE
  setProfilePhoto(URL.createObjectURL(file)) // preview
  setHasChanges(true)
}



  /* ================= EFFECT ================= */

  useEffect(() => {
    fetchProfile()
    fetchAdmins()
  }, [])

  /* ================= SCROLL ================= */

  const scrollToSection = (section: SettingsSection) => {
    setActiveSection(section)
    document
      .getElementById(`section-${section}`)
      ?.scrollIntoView({ behavior: "smooth" })
  }


  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* <div className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0 overflow-x-auto lg:overflow-y-auto">
        <div className="p-6 space-y-1">
          <button
            onClick={() => scrollToSection("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "profile" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile Settings</span>
          </button>

          <button
            onClick={() => scrollToSection("admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "admin" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Admin Management</span>
          </button>

          <button
            onClick={() => scrollToSection("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "notifications" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </button>
        </div>
      </div> */}

      <div className="flex-1 overflow-y-auto">
        <div className="lg:px-8 lg:py-8 py-8 px-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 mt-1">
                Manage your application preferences, profile details, and system configurations.
              </p>
            </div>
            <div className="flex gap-3">
              {hasChanges && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button onClick={handleSaveChanges} className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section id="section-profile" className="bg-white rounded-xl shadow-sm border border-gray-200 sm:px-6 sm:py-6 px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Verified
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
<div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br  flex items-center justify-center text-white text-2xl font-semibold">
  {profilePhoto ? (
    <img
      src={profilePhoto}
      alt="Profile"
      className="w-full h-full object-cover"
    />
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
  onClick={() =>
    document.getElementById("profilePhotoInput")?.click()
  }
  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
>
  <Camera className="w-4 h-4" />
</button>

                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <Input
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                          setHasChanges(true)
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <Input
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                          setHasChanges(true)
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <Input
                        value={phone}
                        onChange={(e) => {
                          setPhone(formatPhone(e.target.value))
                          setHasChanges(true)
                        }}
                        placeholder="954 458 4785"
                        className="w-full"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setHasChanges(true)
                        }}
                        className="pl-10 w-full"
                      />
                    </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Description</label>
                    <Textarea
                      value={roleDescription}
                      onChange={(e) => {
                        setRoleDescription(e.target.value)
                        setHasChanges(true)
                      }}
                      className="w-full resize-none bg-white text-black border-1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section id="section-admin" className="bg-white rounded-xl shadow-sm border border-gray-200 sm:px-6 sm:py-6 px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Administrator Accounts</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage system access, roles, and permissions.</p>
                </div>
                <Button
                  onClick={() => setIsAddAdminModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Admin
                </Button>
              </div>

              <div className="md:hidden space-y-4">
  {admins.map((admin) => (
    <div
      key={admin.id}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-white font-semibold">
          {admin.profile_photo ? (
            <img
              src={admin.profile_photo}
              alt={admin.name}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(admin.first_name, admin.last_name)
          )}
        </div>

        <div>
          <div className="font-semibold text-gray-900">
            {admin.first_name} {admin.last_name}
          </div>
          <div className="text-sm text-gray-500">
            {admin.email}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Role</span>
          <span className="text-blue-600 capitalize font-medium">
            {admin.role}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Phone</span>
          <span className="text-black capitalize">
            {admin.phone}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Status</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              admin.active
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-red-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                admin.active ? "bg-green-500" : "bg-red-400"
              }`}
            />
            {admin.active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t">
          <span className="text-gray-500 font-medium">Enable</span>
          <Switch
            checked={admin.active}
            disabled={admin.id === profileId}
            onCheckedChange={() =>
              toggleAdminStatus(admin.id, admin.active)
            }
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-500 font-medium">Actions</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>

              {admin.id !== profileId && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => deleteAdmin(admin.id)}
                >
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  ))}
</div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Administrator
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role 
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone 
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Enable
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                 <tbody className="divide-y divide-gray-100">
  {admins.map((admin) => (
    <tr key={admin.id} className="hover:bg-gray-50">
      {/* ADMIN */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-white font-semibold">
  {admin.profile_photo ? (
    <img
      src={admin.profile_photo}
      alt={admin.name}
      className="w-full h-full object-cover"
    />
  ) : (
    getInitials(admin.first_name, admin.last_name)
  )}
</div>

          <div>
            <div className="font-medium text-gray-900">
              {admin.first_name} {admin.last_name}
            </div>
            <div className="text-sm text-gray-500">
              {admin.email}
            </div>
          </div>
        </div>
      </td>

      {/* ROLE */}
      <td className="py-4 px-4">
        <span className="font-medium text-blue-600 capitalize">
          {admin.role}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="font-medium text-black capitalize">
          {admin.phone}
        </span>
      </td>

      {/* STATUS */}
      <td className="py-4 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            admin.active
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-red-600"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              admin.active ? "bg-green-500" : "bg-red-400"
            }`}
          />
          {admin.active ? "Active" : "Inactive"}
        </span>
      </td>

      {/* ACTIONS */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={admin.active}
            disabled={admin.id === profileId}
            onCheckedChange={() =>
              toggleAdminStatus(admin.id, admin.active)
            }
          />
          </div>
</td>

<td className="py-4 px-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}

              {admin.id !== profileId && (
                <DropdownMenuItem className="text-red-600" onClick={() => deleteAdmin(admin.id)}>
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
            </section>

            <section id="section-notifications" className="bg-white rounded-xl shadow-sm border border-gray-200 sm:px-6 sm:py-6 px-4 py-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">New Technician Registration</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Get notified when a new technician signs up for approval.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newTechnicianRegistration}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, newTechnicianRegistration: checked })
                      setHasChanges(true)
                    }}
                    className="data-[state=checked]:bg-blue-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">New Booking Created</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Receive an alert for every new service booking.</p>
                  </div>
                  <Switch
                    checked={notifications.newBookingCreated}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, newBookingCreated: checked })
                      setHasChanges(true)
                    }}
                    className="data-[state=checked]:bg-blue-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Settlement Reports</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Weekly summary of payouts and commissions.</p>
                  </div>
                  <Switch
                    checked={notifications.settlementReports}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, settlementReports: checked })
                      setHasChanges(true)
                    }}
                    className="data-[state=checked]:bg-blue-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div>

                {/* <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="font-medium text-gray-900">System Errors</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Critical alerts regarding server status or API failures.
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemErrors}
                    onCheckedChange={(checked) => {
                      setNotifications({ ...notifications, systemErrors: checked })
                      setHasChanges(true)
                    }}
                    className="data-[state=checked]:bg-blue-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div> */}
              </div>
            </section>
          </div>
        </div>
      </div>

      <AddAdminModal
        isOpen={isAddAdminModalOpen}
        onClose={() => setIsAddAdminModalOpen(false)}
        onAdd={handleAddAdmin}
      />
    </div>
  )
}
