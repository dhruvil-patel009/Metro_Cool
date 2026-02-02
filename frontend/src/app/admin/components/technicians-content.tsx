"use client"

import { useEffect, useMemo, useState } from "react"
import { Users, UserCheck, Clock, Filter, Eye, MoreVertical, UserX  } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import Image from "next/image"
import { authHeaders } from "../../lib/authHeader"
import { toast } from "react-toastify"
import { Skeleton } from "@/app/components/ui/skeleton"
import { useRouter } from "next/navigation"




/* ================= TYPES ================= */

type ApiTechnician = {
  id: string
  services: string[]
  status: "active" | "inactive"
  approval_status: "approved" | "pending" | "rejected"
  profiles: {
    first_name: string
    last_name: string
    phone: string
    profile_photo: string
  }
}

type TechnicianUI = {
  id: string
  name: string
  techId: string
  phone: string
  services: string[]
  status: "Active" | "Inactive"
  approval: "Approved" | "Review" | "Pending"
  avatar: string
}

/* ================= COMPONENT ================= */

export default function TechniciansContent() {
  const [activeTab, setActiveTab] =
    useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1)
  const [allTechnicians, setAllTechnicians] = useState<TechnicianUI[]>([])

  const limit = 3

  const [requests, setRequests] = useState<ApiTechnician[]>([])
  const [total, setTotal] = useState(0)
  const [viewTech, setViewTech] = useState<any>(null);
  const [editTech, setEditTech] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [totalTechnicians, setTotalTechnicians] = useState(0)
  const [activeTechnicians, setActiveTechnicians] = useState(0)
  const [inactiveTechnicians, setInActiveTechnicians] = useState(0)
  const [pendingRequests, setPendingRequests] = useState(0)
  const router = useRouter();



  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  /* ================= API CALLS ================= */

const fetchTechnicians = async () => {
  try {
    setLoading(true)

    const res = await fetch(
      `${BASE_URL}/admin/technicians?page=${currentPage}&limit=${limit}`,
      { headers: authHeaders() }
    )

    if (!res.ok) {
      console.error("Fetch technicians failed:", res.status)
      setAllTechnicians([])
      setTotal(0)
      return
    }

    const json = await res.json()

    const raw: ApiTechnician[] = Array.isArray(json.data) ? json.data : []

    const mappedData: TechnicianUI[] = raw.map((t) => ({
      id: t.id,
      techId: t.id.slice(0, 8).toUpperCase(),
      name: `${t.profiles.first_name} ${t.profiles.last_name}`,
      phone: t.profiles.phone,
      services: t.services ?? [],
      status: t.status === "active" ? "Active" : "Inactive",
      approval:
        t.approval_status === "approved"
          ? "Approved"
          : t.approval_status === "pending"
          ? "Review"
          : "Pending",
      avatar: t.profiles.profile_photo || "/placeholder.svg",
    }))

    setAllTechnicians(mappedData)
    setTotal(Number(json.total ?? 0))
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}


const fetchStats = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/admin/technicians/stats`,
      { headers: authHeaders() }
    )

    if (!res.ok) {
      console.error("Stats fetch failed:", res.status)
      return
    }

    const data = await res.json()

    setTotalTechnicians(Number(data.total ?? 0))
    setActiveTechnicians(Number(data.active ?? 0))
    setInActiveTechnicians(Number(data.inactive ?? 0))
    setPendingRequests(Number(data.pending ?? 0))
  } catch (err) {
    console.error(err)
  }
}



  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken")
  //   if (token) {
  //     fetchStats()
  //   }
  // }, [])

  useEffect(() => {
      fetchStats()
      fetchRequests()
  }, [])

  /* ================= FILTER LOGIC (🔥 MAIN FIX) ================= */

  const filteredTechnicians = useMemo(() => {
    if (activeTab === "active") {
      return allTechnicians.filter(t => t.status === "Active")
    }

    if (activeTab === "inactive") {
      return allTechnicians.filter(t => t.status === "Inactive")
    }

    return allTechnicians
  }, [activeTab, allTechnicians])

  const toggleStatus = async (id: string, makeActive: boolean) => {
    try {
      await fetch(`${BASE_URL}/admin/technicians/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
           cache: "no-store",
        body: JSON.stringify({
          status: makeActive ? "active" : "inactive",
        }),
      });

      // 🔥 OPTIMISTIC UPDATE (FAST)
      setAllTechnicians((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: makeActive ? "Active" : "Inactive" }
            : t
        )
      );

      fetchStats()
      toast.success(
        makeActive ? "Technician activated" : "Technician deactivated"
      );
    } catch {
      toast.error("Status update failed");
    }
  };


const fetchRequests = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/admin/technicians/requests`,
      { headers: authHeaders() }
    )

    if (!res.ok) {
      setRequests([])
      return
    }

    const json = await res.json()

    // ✅ ALWAYS FORCE ARRAY
    if (Array.isArray(json)) {
      setRequests(json)
    } else if (Array.isArray(json.data)) {
      setRequests(json.data)
    } else {
      setRequests([])
    }
  } catch (err) {
    console.error(err)
    setRequests([])
  }
}


  const handleApprove = async (id: string) => {
    await fetch(`${BASE_URL}/admin/technicians/${id}/approve`, {
      method: "PATCH",
      headers: authHeaders(),
      cache: "no-store"
    });
    fetchTechnicians();
    fetchRequests();
    fetchStats()
  };

  const handleReject = async (id: string) => {
    await fetch(`${BASE_URL}/admin/technicians/${id}/reject`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    fetchRequests();
  };

  const handleDeactivate = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/admin/technicians/${id}/deactivate`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      toast.success("Technician deactivated");
      fetchTechnicians();
    } catch {
      toast.error("Failed to deactivate");
    }
  };



  const handleView = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/technicians/${id}`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error();

      setViewTech(await res.json());
    } catch {
      toast.error("Failed to load technician");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this technician?")) {
      toast.warning("Deletion cancelled");
      return;
    }

    try {
      await fetch(`${BASE_URL}/admin/technicians/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
        cache: "no-store",
      });

      toast.success("Technician deleted");
      fetchTechnicians();
      fetchStats()
    } catch {
      toast.error("Delete failed");
    }
  };


  useEffect(() => {
    fetchTechnicians()
  }, [currentPage])

  useEffect(() => {
    fetchRequests()
  }, [])

  const formatPhone = (phone: string) => {
    if (!phone) return "";

    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 10) return phone;

    return `(${digits.slice(0, 3)}) - ${digits.slice(3, 6)} - ${digits.slice(6)}`;
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600 font-medium">Total Technicians</span>
              <div className="p-2.5 bg-cyan-50 rounded-lg">
                <Users className="w-5 h-5 text-cyan-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{totalTechnicians}</h3>
              {/* <span className="text-sm text-green-600 flex items-center mb-1 font-medium">
                <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                +12%
              </span> */}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600 font-medium">Active Now</span>
              <div className="p-2.5 bg-green-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{activeTechnicians}</h3>
              {/* <span className="text-sm text-green-600 flex items-center mb-1 font-medium">
                <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                +5%
              </span> */}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4 ">
              <span className="text-sm text-gray-600 font-medium">InActive Now</span>
              <div className="p-2.5 bg-red-100 rounded-lg">
                <UserX  className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{inactiveTechnicians}</h3>
              {/* <span className="text-sm text-green-600 flex items-center mb-1 font-medium">
                <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                +5%
              </span> */}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <span className="text-sm text-gray-600 font-medium">Pending Requests</span>
              <div className="p-2.5 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{pendingRequests}</h3>
              <span className="text-sm text-orange-600 font-semibold mb-1">! Action Needed</span>
            </div>
          </div>
        </div>
        {/* ===== TABLE ===== */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-4 bg-gray-200 p-1 border rounded-3xl w-fit">
                {["all", "active", "inactive"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab as any)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab
                        ? "bg-white text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {/* <Button variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50 bg-transparent text-black">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button> */}
                {/* <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm">
                  <Plus className="w-4 h-4" />
                  Add Technician
                </Button> */}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Technician
                  </th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Phone Number
                  </th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Services Assigned
                  </th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Approval
                  </th>
                  <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  [...Array(limit)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                ) : filteredTechnicians.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No technicians found
                    </td>
                  </tr>
                ) : (
                  filteredTechnicians.map((tech) => (
                    <tr key={tech.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Image
                          src={tech.avatar}
                          alt={tech.name}
                          width={40}
                          height={40}
                          className="rounded-full w-16 h-16"
                        />
                        <div>
                          <div className="font-semibold">{tech.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {tech.techId}
                          </div>
                        </div>
                      </td>

                      <td className="px-6">{formatPhone(tech.phone)}</td>

                      <td className="px-6">
                        <div className="flex gap-2 flex-wrap">
                          {tech.services.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${tech.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                              }`}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {tech.status}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${tech.approval === "Approved"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-orange-50 text-orange-600"
                            }`}
                        >
                          {tech.approval}
                        </div>
                      </td>
                      <td className="px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/Technician/${tech.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>

                            {tech.status === "Active" ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleStatus(tech.id, false)
                                }
                                className="text-orange-600"
                              >
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleStatus(tech.id, true)
                                }
                                className="text-green-600"
                              >
                                Activate
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(tech.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== PAGINATION ===== */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * limit + 1}–
              {Math.min(currentPage * limit, total)} of {total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage * limit >= total}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* ===== REQUESTS ===== */}
        <h2 className="text-xl font-bold text-gray-900">
          Technician Requests
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.isArray(requests) && requests.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-4 mb-4">
                <Image
                  src={r.profiles.profile_photo || "/placeholder.svg"}
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-full w-16 h-16"
                />
                <div>
                  <h3 className="font-bold">
                    {r.profiles.first_name} {r.profiles.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">Pending Approval</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleReject(r.id)}>
                  Reject
                </Button>
                <Button onClick={() => handleApprove(r.id)}>
                  Approve
                </Button>
                <Button className="cursor-pointer" variant="outline" size="icon" onClick={() => router.push(`/admin/Technician/${r.id}`)} >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
