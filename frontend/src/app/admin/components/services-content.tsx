"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
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
import Link from "next/link";
import { AdminPageShell } from "./admin-page-shell";
import { getAllServicesAdmin } from "@/app/lib/services.api";

export function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getAllServicesAdmin().then((data) => {
      const list = Array.isArray(data) ? data : []
      const unique = [...new Set(
        list.map((s: { category?: string }) => s.category?.trim()).filter(Boolean)
      )].sort() as string[]
      setCategories(unique)
    }).catch(() => setCategories([]))
  }, [refreshKey])

  const categoryOptions = useMemo(() =>
    categories.map(c => ({
      value: c.toLowerCase().replace(/\s+/g, "-"),
      label: c,
    })),
  [categories])

  return (
    <AdminPageShell
      title="Services"
      description="Manage, track, and update your AC service offerings."
      action={
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/Services/content">
            <Button variant="outline" className="h-10">
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </Link>
          <Button
            onClick={() => setIsAddServiceModalOpen(true)}
            className="h-10 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 border border-gray-100 shadow-sm lg:flex-row lg:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services by name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 text-gray-900 border-gray-200"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white text-gray-900 border-gray-200">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map(c => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ServicesTable
        key={refreshKey}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          setIsAddServiceModalOpen(false);
          setRefreshKey(k => k + 1);
        }}
      />
    </AdminPageShell>
  );
}
