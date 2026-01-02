"use client"

import { useState } from "react"
import { MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { Switch } from "@/app/components/ui/switch"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Button } from "@/app/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { cn } from "@/app/lib/utils"

interface Service {
  id: string
  name: string
  serviceId: string
  image: string
  category: string
  categoryColor: string
  price: number
  priceType: "Fixed Rate" | "Hourly"
  status: "Active" | "Inactive"
  enabled: boolean
}

const servicesData: Service[] = [
  {
    id: "1",
    name: "Full AC Service & Cleaning",
    serviceId: "#SRV-001",
    image: "/ac-unit.jpg",
    category: "AC Repair",
    categoryColor: "text-blue-600 bg-blue-50",
    price: 149.0,
    priceType: "Fixed Rate",
    status: "Active",
    enabled: true,
  },
  {
    id: "2",
    name: "Gas Furnace Inspection",
    serviceId: "#SRV-024",
    image: "/old-fashioned-furnace.png",
    category: "Heating",
    categoryColor: "text-orange-600 bg-orange-50",
    price: 89.0,
    priceType: "Hourly",
    status: "Active",
    enabled: false,
  },
  {
    id: "3",
    name: "Duct Cleaning (Seasonal)",
    serviceId: "#SRV-045",
    image: "/duct.jpg",
    category: "Maintenance",
    categoryColor: "text-yellow-600 bg-yellow-50",
    price: 199.0,
    priceType: "Fixed Rate",
    status: "Inactive",
    enabled: false,
  },
  {
    id: "4",
    name: "Smart Thermostat Setup",
    serviceId: "#SRV-102",
    image: "/smart-thermostat.png",
    category: "Smart Home",
    categoryColor: "text-purple-600 bg-purple-50",
    price: 75.0,
    priceType: "Fixed Rate",
    status: "Active",
    enabled: true,
  },
  {
    id: "5",
    name: "System Diagnostics",
    serviceId: "#SRV-115",
    image: "/diagnostic-tool.jpg",
    category: "AC Repair",
    categoryColor: "text-blue-600 bg-blue-50",
    price: 65.0,
    priceType: "Hourly",
    status: "Active",
    enabled: true,
  },
]

interface ServicesTableProps {
  searchQuery: string
  selectedCategory: string
}

export function ServicesTable({ searchQuery, selectedCategory }: ServicesTableProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [services, setServices] = useState(servicesData)
  const itemsPerPage = 5

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || service.category.toLowerCase().replace(" ", "-") === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentServices = filteredServices.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(currentServices.map((s) => s.id))
    } else {
      setSelectedServices([])
    }
  }

  const handleSelectService = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId])
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    }
  }

  const handleToggleEnable = (serviceId: string) => {
    setServices(
      services.map((service) => (service.id === serviceId ? { ...service, enabled: !service.enabled } : service)),
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <Checkbox
                  checked={currentServices.length > 0 && currentServices.every((s) => selectedServices.includes(s.id))}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Service Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Enable
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentServices.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={(checked) => handleSelectService(service.id, checked as boolean)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">ID: {service.serviceId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", service.categoryColor)}>
                    {service.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">${service.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">{service.priceType}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        service.status === "Active" ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    <span className="text-sm text-gray-700">{service.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Switch checked={service.enabled} onCheckedChange={() => handleToggleEnable(service.id)} />
                </td>
                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Service</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredServices.length)} of {filteredServices.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={cn(currentPage === page && "bg-cyan-500 text-white hover:bg-cyan-600")}
            >
              {page}
            </Button>
          ))}
          <span className="px-2 text-sm text-gray-500">...</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
