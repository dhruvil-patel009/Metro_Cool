"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, MoreVertical, Filter, Snowflake, Flame, Wind, Zap, Settings, ClipboardList } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Switch } from "@/app/components/ui/switch"
import Image from "next/image"
import { AddCategoryModal } from "./add-categories-model"


interface Category {
  id: string
  name: string
  description: string
  image: string
  icon: React.ReactNode
  iconColor: string
  isActive: boolean
}

const categories: Category[] = [
  {
    id: "cat-001",
    name: "AC Installation",
    description: "Complete installation services for residential split and central air units.",
    image: "/ac-unit.jpg",
    icon: <Snowflake className="w-5 h-5 text-white" />,
    iconColor: "bg-cyan-500",
    isActive: true,
  },
  {
    id: "cat-002",
    name: "Heating Repair",
    description: "Diagnostics and repair for furnaces, heat pumps, and boilers.",
    image: "/old-fashioned-furnace.png",
    icon: <Flame className="w-5 h-5 text-white" />,
    iconColor: "bg-orange-500",
    isActive: true,
  },
  {
    id: "cat-003",
    name: "Duct Cleaning",
    description: "Professional cleaning of air ducts to improve indoor air quality.",
    image: "/duct.jpg",
    icon: <Wind className="w-5 h-5 text-white" />,
    iconColor: "bg-gray-500",
    isActive: false,
  },
  {
    id: "cat-004",
    name: "Emergency Services",
    description: "24/7 Rapid response for critical HVAC failures.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    icon: <Zap className="w-5 h-5 text-white" />,
    iconColor: "bg-red-500",
    isActive: true,
  },
  {
    id: "cat-005",
    name: "Smart Thermostats",
    description: "Installation and configuration of smart home climate control systems.",
    image: "/smart-thermostat.png",
    icon: <Settings className="w-5 h-5 text-white" />,
    iconColor: "bg-purple-500",
    isActive: true,
  },
  {
    id: "cat-006",
    name: "Maintenance Plans",
    description: "Annual and bi-annual system checkups and filter replacements.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    icon: <ClipboardList className="w-5 h-5 text-white" />,
    iconColor: "bg-blue-600",
    isActive: true,
  },
]

export function CategoriesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryStates, setCategoryStates] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.isActive }), {}),
  )

    const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && categoryStates[category.id]) ||
      (statusFilter === "inactive" && !categoryStates[category.id])
    return matchesSearch && matchesStatus
  })

  const toggleCategory = (categoryId: string) => {
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  function handleAddCategory(category: { name: string; image: string; isActive: boolean }): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span className="hover:text-gray-900 cursor-pointer transition-colors">Dashboard</span>
        <span>›</span>
        <span className="text-gray-900 font-medium">Categories</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Categories Management</h1>
          <p className="text-gray-500">Manage service categories for the HVAC platform.</p>
        </div>
        <Button           onClick={() => setIsModalOpen(true)}
 className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition-all hover:shadow-md shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 h-10"
          />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white border-gray-200 h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <div
            key={category.id}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Icon Badge */}
              <div
                className={`absolute bottom-3 left-3 ${category.iconColor} w-11 h-11 rounded-lg flex items-center justify-center shadow-lg`}
              >
                {category.icon}
              </div>
              {/* Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full w-8 h-8 shadow-sm"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Edit Category</DropdownMenuItem>
                  <DropdownMenuItem>View Services</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{category.description}</p>

              {/* Status and Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${categoryStates[category.id] ? "bg-green-500" : "bg-gray-400"}`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      categoryStates[category.id] ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {categoryStates[category.id] ? "Active" : "Inactive"}
                  </span>
                </div>
                <Switch
                  checked={categoryStates[category.id]}
                  onCheckedChange={() => toggleCategory(category.id)}
                    className="data-[state=checked]:bg-cyan-500     data-[state=unchecked]:bg-gray-200"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Create Category Card */}
        <div
                  onClick={() => setIsModalOpen(true)}

          className="bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-cyan-400 hover:bg-gray-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 min-h-[360px]"
          style={{
            animation: `fadeInUp 0.5s ease-out ${filteredCategories.length * 0.1}s both`,
          }}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-cyan-50 transition-colors">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Category</h3>
          <p className="text-sm text-gray-500 text-center">Add a new service category to the platform</p>
        </div>
      </div>

      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddCategory} />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
