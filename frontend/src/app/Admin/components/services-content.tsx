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
    <div className="flex min-h-screen bg-gray-50/50">

      <div className="flex flex-1 flex-col">

        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage, track, and update your HVAC service offerings.</p>
          </div>

          {/* Filters and Search Bar */}
          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search services by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 border-gray-200 pl-10 focus-visible:ring-cyan-500 text-black"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 w-full border-gray-200 sm:w-[200px] text-black">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 " />
                    <SelectValue placeholder="All Categories"  />
                  </div>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10  hover:bg-gray-50 bg-transparent"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Printer className="h-4 w-4 text-gray-600" />
              </Button>
              <Button className="h-10 bg-cyan-500 text-white shadow-sm transition-all hover:bg-cyan-600 hover:shadow">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
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
