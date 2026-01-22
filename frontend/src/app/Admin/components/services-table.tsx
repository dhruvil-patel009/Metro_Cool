"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";
import { apiFetch } from "@/app/lib/api";
import { deleteService, getAllServicesAdmin } from "@/app/lib/services.api";
import { EditServiceModal } from "../components/edit-service-modal";

interface Service {
  id: string;
  title: string;
  service_code: string;
  category: string;
  price: number;
  pricing_type: "fixed" | "hourly";
  image_url?: string;
  is_active: boolean;
}

interface ServicesTableProps {
  searchQuery: string;
  selectedCategory: string;
}

export function ServicesTable({
  searchQuery,
  selectedCategory,
}: ServicesTableProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);


  const itemsPerPage = 5;

  /* ---------------- FETCH SERVICES ---------------- */
  useEffect(() => {
    apiFetch("/services/admin")
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- FILTERING ---------------- */
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      service.category.toLowerCase().replace(" ", "-") === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  /* ---------------- SELECTION ---------------- */
  const handleSelectAll = (checked: boolean) => {
    setSelectedServices(
      checked ? currentServices.map((s) => s.id) : []
    );
  };

  const handleSelectService = (id: string, checked: boolean) => {
    setSelectedServices((prev) =>
      checked ? [...prev, id] : prev.filter((s) => s !== id)
    );
  };

  /* ---------------- ENABLE / DISABLE ---------------- */
  const handleToggleEnable = async (service: Service) => {
    await apiFetch(`/services/${service.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !service.is_active }),
    });

    setServices((prev) =>
      prev.map((s) =>
        s.id === service.id
          ? { ...s, is_active: !s.is_active }
          : s
      )
    );
  };

  
  const handleDelete = async (id: string) => {
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading services...</div>;
  }

  /* ---------------- UI ---------------- */
  return (
    <>
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50/50">
            <tr>
              <th className="w-12 px-6 py-4">
                <Checkbox
                  checked={
                    currentServices.length > 0 &&
                    currentServices.every((s) =>
                      selectedServices.includes(s.id)
                    )
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Service
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Enable
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentServices.map((service, index) => (
              <tr
                key={service.id}
                className="hover:bg-gray-50/50"
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <td className="px-6 py-4">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={(checked) =>
                      handleSelectService(service.id, checked as boolean)
                    }
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={service.image_url || "/placeholder.svg"}
                      className="h-14 w-14 rounded-lg object-cover ring-1 ring-gray-200"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {service.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {service.service_code}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                    {service.category}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="font-semibold">
                    ${service.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {service.pricing_type === "fixed"
                      ? "Fixed Rate"
                      : "Hourly"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      service.is_active
                        ? "text-green-600"
                        : "text-red-500"
                    )}
                  >
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <Switch
                    checked={service.is_active}
                    onCheckedChange={() =>
                      handleToggleEnable(service)
                    }
                    className="data-[state=checked]:bg-cyan-500"
                  />
                </td>

                <td className="px-6 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem   onClick={() => setEditingService(service)}
>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600"  onClick={() => handleDelete(service.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
      {editingService && (
  <EditServiceModal
    isOpen={!!editingService}
    service={editingService}
    onClose={() => {
      setEditingService(null);
      getAllServicesAdmin().then(setServices); // refresh
    }}
  />
  )}
    
    </>
  );
}
