"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Download,
  Printer,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ServicesTable } from "./services-table";
import { AddServiceModal } from "../components/add-services-model";

export function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  // 🔄 Force ServicesTable refetch
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Services Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage, track, and update your AC service offerings.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-sm">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search services by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 text-black focus-visible:ring-cyan-500"
                />
              </div>

              {/* ✅ CATEGORY VALUES MATCH BACKEND */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 w-full sm:w-[200px] text-black">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <SelectValue placeholder="All Categories" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="Heating">Heating</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Smart Home">Smart Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4 text-gray-600" />
              </Button>
              <Button
                onClick={() => setIsAddServiceModalOpen(true)}
                className="h-10 bg-cyan-500 text-white hover:bg-cyan-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </div>
          </div>

          {/* ✅ TABLE REFRESHES AFTER ADD */}
          <ServicesTable
            key={refreshKey}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>

      {/* ✅ MODAL CALLBACK */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          setIsAddServiceModalOpen(false);
          setRefreshKey((k) => k + 1); // 🔄 refresh table
        }}
      />
    </div>
  );
}
