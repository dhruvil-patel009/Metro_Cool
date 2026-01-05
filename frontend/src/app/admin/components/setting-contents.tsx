"use client"

import { useState } from "react"
import { User, Shield, Bell, Camera, Mail, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import AddAdminModal from "./add-admin-model"

type SettingsSection = "profile" | "admin" | "notifications"

export default function SettingsContent() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [hasChanges, setHasChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)

  const [firstName, setFirstName] = useState("Alex")
  const [lastName, setLastName] = useState("Johnson")
  const [email, setEmail] = useState("alex.admin@comforthvac.com")
  const [roleDescription, setRoleDescription] = useState("Responsible for system configuration and user management.")

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.admin@comforthvac.com",
      avatar: "AJ",
      role: "Super Admin",
      permissions: "Full system access",
      status: true,
      isCurrent: true,
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah.miller@comforthvac.com",
      avatar: "SM",
      role: "Operations Manager",
      permissions: "Technicians, Bookings, Reports",
      status: true,
      isCurrent: false,
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.c@comforthvac.com",
      avatar: "DC",
      role: "Support Agent",
      permissions: "View-only access",
      status: false,
      isCurrent: false,
    },
  ])

  const [notifications, setNotifications] = useState({
    newTechnicianRegistration: true,
    newBookingCreated: false,
    settlementReports: true,
    systemErrors: true,
  })

  const handleSaveChanges = () => {
    setHasChanges(false)
    alert("Changes saved successfully!")
  }

  const handleCancel = () => {
    setHasChanges(false)
  }

  const toggleAdminStatus = (id: number) => {
    setAdmins(admins.map((admin) => (admin.id === id ? { ...admin, status: !admin.status } : admin)))
    setHasChanges(true)
  }

  const handleAddAdmin = (newAdmin: any) => {
    setAdmins([...admins, newAdmin])
    setHasChanges(true)
  }

  const scrollToSection = (section: SettingsSection) => {
    setActiveSection(section)
    const element = document.getElementById(`section-${section}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex h-full">
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
        <div className="p-6 space-y-1">
          <button
            onClick={() => scrollToSection("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "profile" ? "bg-cyan-50 text-cyan-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile Settings</span>
          </button>

          <button
            onClick={() => scrollToSection("admin")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "admin" ? "bg-cyan-50 text-cyan-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Admin Management</span>
          </button>

          <button
            onClick={() => scrollToSection("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === "notifications" ? "bg-cyan-50 text-cyan-600" : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
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
              <Button onClick={handleSaveChanges} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-8">
            <section id="section-profile" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Verified
                </span>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-semibold">
                      {firstName[0]}
                      {lastName[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full shadow-lg transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-cyan-500 text-sm font-medium mt-2 hover:text-cyan-600">Change Photo</button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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

            <section id="section-admin" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Administrator Accounts</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage system access, roles, and permissions.</p>
                </div>
                <Button
                  onClick={() => setIsAddAdminModalOpen(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Admin
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Administrator
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role & Permissions
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${admin.id === 1 ? "bg-amber-500" : admin.id === 2 ? "bg-blue-500" : "bg-orange-500"
                                }`}
                            >
                              {admin.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{admin.name}</div>
                              <div className="text-sm text-gray-500">{admin.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-1.5 h-1.5 rounded-full ${admin.id === 1 ? "bg-purple-500" : admin.id === 2 ? "bg-blue-500" : "bg-orange-500"
                                  }`}
                              ></span>
                              <span
                                className={`font-medium ${admin.id === 1
                                    ? "text-purple-600"
                                    : admin.id === 2
                                      ? "text-blue-600"
                                      : "text-orange-600"
                                  }`}
                              >
                                {admin.role}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">{admin.permissions}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {admin.isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              Current User
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${admin.status ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${admin.status ? "bg-green-500" : "bg-gray-400"}`}
                              ></span>
                              {admin.status ? "Active" : "Inactive"}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {!admin.isCurrent && (
                              <Switch checked={admin.status} onCheckedChange={() => toggleAdminStatus(admin.id)} className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"
                              />
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                  <MoreVertical className="w-5 h-5 text-gray-400" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {!admin.isCurrent && (
                                  <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="section-notifications" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"

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
                    className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"

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
                    className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div>

                <div className="flex items-center justify-between py-4">
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
                    className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"

                  />
                </div>
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
