"use client"

import { useEffect, useState } from "react"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/app/components/ui/dialog"
import {
  MapPin, Calendar, CheckCircle2, BadgeCheck,
  Phone, Mail, Loader2, AlertCircle, Edit2,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import dayjs from "dayjs"

const API      = process.env.NEXT_PUBLIC_API_BASE_URL!
const getToken = () =>
  typeof window === "undefined" ? "" :
  localStorage.getItem("accessToken") || localStorage.getItem("token") || ""

/* ── Fetch profile ── */
const fetchProfile = async () => {
  const res = await fetch(`${API}/technician/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  if (!res.ok) throw new Error("Failed to load profile")
  return res.json()
}

/* ── Fetch completed jobs (earnings) ── */
const fetchBookings = async (): Promise<any[]> => {
  const res = await fetch(`${API}/technician/earnings`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  })
  if (!res.ok) return []
  const json = await res.json()
  return Array.isArray(json.bookings) ? json.bookings : []
}

export default function ProfilePage() {
  const qc = useQueryClient()

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["tech-profile"],
    queryFn:  fetchProfile,
    staleTime: 5 * 60_000,
  })

  const { data: bookings = [] } = useQuery({
    queryKey: ["technician-earnings"],   // shared with earnings page
    queryFn:  fetchBookings,
    staleTime: 60_000,
  })

  /* ── Edit dialog ── */
  const [editOpen,    setEditOpen]    = useState(false)
  const [firstName,   setFirstName]   = useState("")
  const [lastName,    setLastName]    = useState("")
  const [phone,       setPhone]       = useState("")

  // Pre-fill when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name  || "")
      setPhone(profile.phone         || "")
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/technician/profile`, {
        method: "PUT",
        headers: {
          Authorization:  `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone }),
      })
      if (!res.ok) throw new Error("Update failed")
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tech-profile"] })
      setEditOpen(false)
      toast.success("Profile updated!")
    },
    onError: () => toast.error("Failed to update profile"),
  })

  /* ── Stats ── */
  const completed   = bookings.filter((b) => b.job_status === "completed").length
  const totalEarned = bookings
    .filter((b) => b.job_status === "completed" && b.total_amount)
    .reduce((s, b) => s + Number(b.total_amount || 0), 0)
  const memberSince = profile?.created_at
    ? dayjs(profile.created_at).format("MMM YYYY")
    : "—"

  /* ── Initials ── */
  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]]
    .filter(Boolean).join("").toUpperCase() || "T"

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Technician"

  /* ── Loading / Error ── */
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="font-medium">Loading profile…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="font-semibold text-red-500">Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and view your stats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: main info ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile header card */}
          <Card className="p-6 border border-slate-200 shadow-sm">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg ring-2 ring-slate-100">
                  <AvatarImage
                    src={profile?.profile_photo || ""}
                    alt={fullName}
                  />
                  <AvatarFallback className="text-xl font-black bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {/* Online dot */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-2xl font-bold text-slate-900 truncate">{fullName}</h2>
                  <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />
                </div>
                <p className="text-slate-500 font-medium text-sm mb-3">AC Service Technician</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {profile?.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Since {memberSince}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setEditOpen(true)}
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </Button>
            </div>
          </Card>

          {/* Personal info card */}
          <Card className="p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "First Name",  value: profile?.first_name },
                { label: "Last Name",   value: profile?.last_name },
                { label: "Phone",       value: profile?.phone },
                { label: "Email",       value: profile?.email },
                { label: "Role",        value: profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—" },
                { label: "Member Since",value: memberSince },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</Label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 font-medium text-sm min-h-[40px]">
                    {value || <span className="text-slate-300">—</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Right: stats ── */}
        <div className="space-y-5">

          {/* Jobs completed */}
          <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Jobs Completed</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{completed}</p>
            <p className="text-xs text-slate-400 mt-1">all time</p>
          </Card>

          {/* Total earned */}
          <Card className="p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <span className="text-lg font-black text-blue-600">₹</span>
              </div>
              <span className="text-sm font-medium text-slate-500">Total Earned</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              ₹{totalEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">from {completed} completed jobs</p>
          </Card>

          {/* Services badge */}
          {profile?.services && Array.isArray(profile.services) && profile.services.length > 0 && (
            <Card className="p-6 border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Service Categories</h3>
              <div className="flex flex-wrap gap-2">
                {profile.services.map((s: string, i: number) => (
                  <Badge key={i} className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1.5">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Experience */}
          {profile?.experience_years && (
            <Card className="p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-500">Experience</span>
              </div>
              <p className="text-3xl font-black text-slate-900">{profile.experience_years}+</p>
              <p className="text-xs text-slate-400 mt-1">years of experience</p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Edit dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} inputMode="numeric" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</>
                : "Save Changes"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
