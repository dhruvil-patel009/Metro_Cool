"use client"

import Link from "next/link"
import {
  ChevronRight,
  Plus,
  MapPin,
  Home,
  Briefcase,
  Trash2,
  Edit2,
  Star,
  MoreHorizontal,
  User,
  Phone,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"
import { ProfileSidebar } from "../../components/profile-sidebar"

const addresses = [
  {
    id: 1,
    type: "Home",
    icon: Home,
    isDefault: true,
    description: "Primary shipping address",
    name: "Alex Johnson",
    address: "1234 Elm Street, Apt 5B, Springfield, IL 62704, USA",
    phone: "(555) 123-4567",
    color: "blue",
  },
  {
    id: 2,
    type: "Office",
    icon: Briefcase,
    isDefault: false,
    description: "Work hours delivery only",
    name: "Alex Johnson",
    address: "456 Tech Park Blvd, Suite 200, Innovation District, IL 62708",
    phone: "(555) 987-6543",
    color: "purple",
  },
  {
    id: 3,
    type: "Lakeside Cabin",
    icon: Home,
    isDefault: false,
    description: "Weekend delivery",
    name: "Sarah Johnson",
    address: "789 Oak Lane, Crystal Lake, Vacation Town, WI 53147",
    phone: "(555) 234-5678",
    color: "orange",
  },
]

export default function AddressesPage() {
  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/user" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/user/profile" className="hover:text-blue-600 transition-colors">
            My Account
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Saved Addresses</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <ProfileSidebar />
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                <p className="text-gray-500 mt-1">Manage your shipping and billing locations for faster checkout.</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-5 h-5 mr-2" />
                Add New Address
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={cn(
                    "bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl group",
                    addr.isDefault ? "border-blue-200 shadow-md ring-1 ring-blue-50" : "border-gray-100",
                  )}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                          addr.color === "blue"
                            ? "bg-blue-50 text-blue-600"
                            : addr.color === "purple"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-orange-50 text-orange-600",
                        )}
                      >
                        <addr.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{addr.type}</h3>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{addr.description}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      {addr.isDefault ? (
                        <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
                      ) : (
                        <MoreHorizontal className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="font-semibold text-gray-900">{addr.name}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-500 leading-relaxed">{addr.address}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-500">{addr.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-12 border-gray-100 text-gray-600 hover:bg-gray-50 transition-all bg-transparent"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {!addr.isDefault && (
                    <button className="w-full text-center text-xs font-bold text-gray-400 hover:text-blue-600 mt-4 transition-colors">
                      Set as Default Address
                    </button>
                  )}
                </div>
              ))}

              {/* Add New State */}
              <div className="bg-gray-50/50 rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition-all min-h-[340px]">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Plus className="w-7 h-7 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Add New Address</h3>
                <p className="text-sm text-gray-400 max-w-[200px]">Add a new destination for shipping or billing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
