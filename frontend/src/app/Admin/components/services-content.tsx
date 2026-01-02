"use client"

import { useState } from "react"
import { Search, Plus, SlidersHorizontal, Download, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { ServicesTable } from "./services-table"

export function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex flex-1 flex-col">

        <main className="flex-1 p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <span>Dashboard</span>
            <span>/</span>
            <span>Services Management</span>
            <span>/</span>
            <span className="font-medium text-gray-900">All Services</span>
          </div>

          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage, track, and update your HVAC service offerings.</p>
            </div>
            <Button className="bg-cyan-500 text-white hover:bg-cyan-600">
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ac-repair">AC Repair</SelectItem>
                  <SelectItem value="heating">Heating</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="smart-home">Smart Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Services Table */}
          <ServicesTable searchQuery={searchQuery} selectedCategory={selectedCategory} />
        </main>
      </div>
    </div>
  )
}
