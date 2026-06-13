"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search, Plus, MoreVertical, Filter, Loader2,
  Briefcase, Snowflake, Flame, Wind, Zap, Settings, ClipboardList,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Switch } from "@/app/components/ui/switch"
import { apiFetch } from "@/app/lib/api"
import { toast } from "react-toastify"
import { AdminPageShell, AdminLoadingState, AdminStatCard } from "./admin-page-shell"
import { cn } from "@/app/lib/utils"

interface Service {
  id: string
  title: string
  category: string
  image_url?: string
  is_active: boolean
}

interface CategoryGroup {
  name: string
  slug: string
  serviceCount: number
  activeCount: number
  isActive: boolean
  image: string
  services: Service[]
}

const ICON_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  installation: { icon: <Snowflake className="w-5 h-5 text-white" />, color: "bg-cyan-500" },
  repair: { icon: <Flame className="w-5 h-5 text-white" />, color: "bg-orange-500" },
  cleaning: { icon: <Wind className="w-5 h-5 text-white" />, color: "bg-gray-500" },
  emergency: { icon: <Zap className="w-5 h-5 text-white" />, color: "bg-red-500" },
  maintenance: { icon: <ClipboardList className="w-5 h-5 text-white" />, color: "bg-blue-600" },
  default: { icon: <Settings className="w-5 h-5 text-white" />, color: "bg-violet-500" },
}

function getCategoryStyle(name: string) {
  const key = name.toLowerCase()
  for (const [k, v] of Object.entries(ICON_MAP)) {
    if (key.includes(k)) return v
  }
  return ICON_MAP.default
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-")
}

export function CategoriesContent() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const data = await apiFetch("/services/admin")
      setServices(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to load categories")
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const categories = useMemo<CategoryGroup[]>(() => {
    const map = new Map<string, Service[]>()
    services.forEach(s => {
      const key = s.category?.trim() || "Uncategorized"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    })

    return Array.from(map.entries()).map(([name, svcs]) => ({
      name,
      slug: slugify(name),
      serviceCount: svcs.length,
      activeCount: svcs.filter(s => s.is_active).length,
      isActive: svcs.some(s => s.is_active),
      image: svcs.find(s => s.image_url)?.image_url || "/placeholder.svg",
      services: svcs,
    })).sort((a, b) => a.name.localeCompare(b.name))
  }, [services])

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && cat.isActive) ||
      (statusFilter === "inactive" && !cat.isActive)
    return matchesSearch && matchesStatus
  })

  const totalServices = services.length
  const activeCategories = categories.filter(c => c.isActive).length

  const toggleCategory = async (cat: CategoryGroup, enable: boolean) => {
    setToggling(cat.slug)
    try {
      await Promise.all(
        cat.services.map(s =>
          apiFetch(`/services/${s.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: enable }),
          })
        )
      )
      setServices(prev =>
        prev.map(s =>
          cat.services.some(cs => cs.id === s.id)
            ? { ...s, is_active: enable }
            : s
        )
      )
      toast.success(`${cat.name} ${enable ? "activated" : "deactivated"}`)
    } catch {
      toast.error("Failed to update category")
    } finally {
      setToggling(null)
    }
  }

  return (
    <AdminPageShell
      title="Categories"
      description="Service categories derived from your live service catalog."
      action={
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => toast.info("Add a new service with a category name to create a category.")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Total Categories"
          value={categories.length}
          icon={<Briefcase className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          loading={loading}
        />
        <AdminStatCard
          label="Active Categories"
          value={activeCategories}
          icon={<Snowflake className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          loading={loading}
        />
        <AdminStatCard
          label="Total Services"
          value={totalServices}
          icon={<ClipboardList className="w-5 h-5 text-violet-600" />}
          iconBg="bg-violet-50"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-gray-200 h-10 text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white border-gray-200 h-10 text-gray-900">
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

      {loading ? (
        <AdminLoadingState label="Loading categories…" />
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center">
          <p className="text-gray-600 font-medium">No categories found</p>
          <p className="text-sm text-gray-400 mt-1">Categories appear when you add services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category, index) => {
            const style = getCategoryStyle(category.name)
            const isToggling = toggling === category.slug

            return (
              <div
                key={category.slug}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
                style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both` }}
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={cn("absolute bottom-3 left-3 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg", style.color)}>
                    {style.icon}
                  </div>
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toast.info(`${category.serviceCount} services in this category`)}>
                        View Services ({category.serviceCount})
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {category.activeCount} of {category.serviceCount} services active
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", category.isActive ? "bg-green-500" : "bg-gray-400")} />
                      <span className={cn("text-sm font-medium", category.isActive ? "text-green-700" : "text-gray-500")}>
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {isToggling ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    ) : (
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={(checked) => toggleCategory(category, checked)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AdminPageShell>
  )
}
