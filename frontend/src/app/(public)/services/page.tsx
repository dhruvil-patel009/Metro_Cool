"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowUpRight, Search, SlidersHorizontal, X, ArrowUpDown, Star } from "lucide-react"
import { getServices, ServiceDTO } from "../lib/services.api"
import { formatINR } from "@/app/lib/currency"

type UIService = {
  id: string
  title: string
  category: string
  price: number
  originalPrice: number
  shortDescription: string
  thumbnailImage: string
  rating: number
  badge?: string
  badgeColor?: string
}

type SortOption = "relevance" | "price-low" | "price-high" | "rating"

export default function ServicesPage() {
  const [services, setServices] = useState<UIService[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("relevance")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  useEffect(() => {
    getServices()
      .then((data: ServiceDTO[]) => {
        const mapped = data.map((service) => ({
          id: service.id,
          title: service.title,
          category: service.category,
          price: service.price,
          originalPrice: service.price + 20,
          shortDescription: service.short_description,
          thumbnailImage: service.image_url || "/placeholder.svg",
          rating: service.rating ?? 0,
          badge: service.badge || undefined,
          badgeColor: service.badge_color || "#2563eb",
        }))
        setServices(mapped)
      })
      .finally(() => setLoading(false))
  }, [])

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(services.map(s => s.category).filter(Boolean)))
  }, [services])

  // Toggle category selection
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = services.filter(s => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(s.category)
      const searchMatch = !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      return categoryMatch && searchMatch
    })

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return result
  }, [services, selectedCategories, searchQuery, sortBy])

  const sortLabels: Record<SortOption, string> = {
    relevance: "Relevance",
    "price-low": "Price: Low to High",
    "price-high": "Price: High to Low",
    rating: "Highest Rated",
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Services</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            AC Services
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Premium cooling solutions for your home. Select a service below to
            view details and book an expert technician.
          </p>
        </header>

        {/* Toolbar: Search + Sort + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
                <span className="sm:hidden">Sort</span>
              </button>

              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowSortDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-40 py-1 overflow-hidden">
                    {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setShowSortDropdown(false) }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                          sortBy === option
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="sm:hidden flex items-center gap-2 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        {/* {categories.length > 1 && (
          <div className={`mb-6 ${showMobileFilter ? "block" : "hidden sm:block"}`}>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategories.length === 0
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                All Services
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 opacity-60">
                    ({services.filter(s => s.category === cat).length})
                  </span>
                </button>
              ))}

            </div>
          </div>
        )} */}

        {/* Results count */}
        <div className="mb-4 text-xs text-gray-500">
          Showing {filteredServices.length} of {services.length} service{services.length !== 1 ? "s" : ""}
          {searchQuery && <span className="text-blue-600 font-medium"> for &ldquo;{searchQuery}&rdquo;</span>}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 sm:p-16 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <p className="font-bold text-gray-800 text-lg">No services found</p>
            <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">
              Try adjusting your search or category filters.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 font-medium rounded-lg transition-colors">
                  Clear search
                </button>
              )}
              {selectedCategories.length > 0 && (
                <button onClick={() => setSelectedCategories([])}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-colors">
                  Show all categories
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-blue-200 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.thumbnailImage}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors group-hover:bg-black/40">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>

                  {service.badge && (
                    <div
                      className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: service.badgeColor }}
                    >
                      {service.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="mb-1.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    {service.category}
                  </div>

                  <h3 className="mb-2 text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {service.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-2 flex-1">
                    {service.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-slate-900">
                        {formatINR(service.price)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatINR(service.originalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      <span>{service.rating.toFixed(1)}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
