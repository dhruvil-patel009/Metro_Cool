"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Phone, Mail, Calendar, Wrench,
  BadgeCheck, ShieldAlert, Loader2, AlertCircle,
  UserCheck, UserX, ExternalLink, Hash,
} from "lucide-react"
import { authHeaders } from "@/app/lib/authHeader"
import { Button } from "@/app/components/ui/button"
import { toast } from "react-toastify"
import { cn } from "@/app/lib/utils"

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

/* ─── Avatar ─── */
function Avatar({ src, name }: { src?: string | null; name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
  if (src && !src.includes("placeholder")) {
    return (
      <img
        src={src}
        alt={name}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md"
      />
    )
  }
  return (
    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-white shadow-md">
      {initials}
    </div>
  )
}

/* ─── Info Row ─── */
function InfoRow({ icon: Icon, label, value, mono = false }: {
  icon: React.ElementType; label: string; value: string; mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={cn("text-sm font-semibold text-gray-900 mt-0.5 break-all", mono && "font-mono")}>{value || "—"}</p>
      </div>
    </div>
  )
}

/* ─── Section Card ─── */
function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-5", className)}>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
      {children}
    </div>
  )
}

/* ─── Main Page ─── */
export default function TechnicianDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [tech, setTech] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await fetch(`${BASE}/admin/technicians/${id}`, { headers: authHeaders() })
        if (!res.ok) throw new Error()
        const d = await res.json()
        setTech(d)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleToggleStatus = async () => {
    if (!tech) return
    const newStatus = tech.status === "active" ? "inactive" : "active"
    setActionLoading(true)
    try {
      const res = await fetch(`${BASE}/admin/technicians/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      setTech((prev: any) => ({ ...prev, status: newStatus }))
      toast.success(`Technician ${newStatus === "active" ? "activated" : "deactivated"}`)
    } catch {
      toast.error("Status update failed")
    } finally {
      setActionLoading(false)
    }
  }

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await fetch(`${BASE}/admin/technicians/${id}/approve`, {
        method: "PATCH", headers: authHeaders(),
      })
      setTech((prev: any) => ({ ...prev, approval_status: "approved", status: "active" }))
      toast.success("Technician approved")
    } catch {
      toast.error("Approval failed")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    setActionLoading(true)
    try {
      await fetch(`${BASE}/admin/technicians/${id}/reject`, {
        method: "PATCH", headers: authHeaders(),
      })
      setTech((prev: any) => ({ ...prev, approval_status: "rejected" }))
      toast.success("Technician rejected")
    } catch {
      toast.error("Rejection failed")
    } finally {
      setActionLoading(false)
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading technician…</p>
      </div>
    </div>
  )

  if (error || !tech) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="font-semibold text-gray-700">Failed to load technician</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Go back</Button>
      </div>
    </div>
  )

  const profile = tech.profiles ?? {}
  const fullName = `${profile.first_name ?? ""} ${profile.middle_name ? profile.middle_name + " " : ""}${profile.last_name ?? ""}`.trim()
  const isActive = tech.status === "active"
  const isPending = tech.approval_status === "pending"
  const isApproved = tech.approval_status === "approved"

  const joinedDate = tech.created_at
    ? new Date(tech.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—"

  const accountCreated = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "—"

  return (
    <div className="min-h-screen bg-gray-50/40">

      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Technicians
          </button>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isPending && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
                </Button>
              </>
            )}
            {!isPending && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleToggleStatus}
                disabled={actionLoading}
                className={isActive
                  ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                  : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}
              >
                {actionLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : isActive
                  ? <><UserX className="w-3.5 h-3.5 mr-1.5" />Deactivate</>
                  : <><UserCheck className="w-3.5 h-3.5 mr-1.5" />Activate</>}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-5">

        {/* ── Profile Hero ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Cover gradient */}
          <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700" />

          <div className="px-5 sm:px-6 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar src={profile.profile_photo} name={fullName} />
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0 sm:pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{fullName}</h1>
                <p className="text-sm text-gray-400 font-mono mt-0.5">#{String(id).slice(0, 8).toUpperCase()}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Active/Inactive */}
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400")} />
                    {isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Approval */}
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                    isApproved ? "bg-blue-50 text-blue-700 border-blue-200"
                      : isPending ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {isApproved
                      ? <><BadgeCheck className="w-3.5 h-3.5" /> Approved</>
                      : isPending
                      ? <><ShieldAlert className="w-3.5 h-3.5" /> Pending Approval</>
                      : "Rejected"}
                  </span>

                  {/* Experience */}
                  {tech.experience_years != null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200">
                      {tech.experience_years}+ yrs experience
                    </span>
                  )}
                </div>
              </div>

              {/* Joined date — desktop */}
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 pb-1 flex-shrink-0">
                <Calendar className="w-4 h-4" />
                Joined {joinedDate}
              </div>
            </div>
          </div>
        </div>

        {/* ── Detail Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Contact */}
          <Card title="Contact Information">
            <InfoRow icon={Phone} label="Phone" value={profile.phone} />
            <InfoRow icon={Mail}  label="Email" value={profile.email} />
            <InfoRow icon={Calendar} label="Account Created" value={accountCreated} />
          </Card>

          {/* Professional */}
          <Card title="Professional Details">
            <InfoRow icon={Wrench} label="Experience" value={tech.experience_years != null ? `${tech.experience_years} years` : "Not specified"} />
            <InfoRow icon={Hash}   label="Promo Code" value={tech.promo_code || "None"} mono />
            <InfoRow icon={Calendar} label="Registered" value={joinedDate} />
          </Card>

          {/* Services */}
          <Card title="Assigned Services" className="md:col-span-2">
            {(tech.services ?? []).length === 0 ? (
              <p className="text-sm text-gray-400 py-2">No services assigned</p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {(tech.services as string[]).map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100">
                    <Wrench className="w-3.5 h-3.5" />
                    {s}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Document */}
          <Card title="Identity Document" className="md:col-span-2">
            {tech.aadhaar_pan_url ? (
              <div className="space-y-3">
                <img
                  src={tech.aadhaar_pan_url}
                  alt="ID Document"
                  className="rounded-xl border border-gray-200 max-h-64 object-contain w-full"
                />
                <a
                  href={tech.aadhaar_pan_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-4 text-gray-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">No identity document uploaded</p>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  )
}
