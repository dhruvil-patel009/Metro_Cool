"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Edit3,
  CheckCircle,
  BadgeCheck,
  MapPin,
  Calendar,
  Zap,
  Star,
  DollarSign,
} from "lucide-react"
import { authHeaders } from "@/app/lib/authHeader"

export default function TechnicianDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [technician, setTechnician] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  /* ================= FETCH TECHNICIAN ================= */

  useEffect(() => {
    if (!id) return

    const fetchTechnician = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/admin/technicians/${id}`,
          { headers: authHeaders() }
        )

        if (!res.ok) throw new Error("Failed")

        const data = await res.json()

         /* ================= DATE FORMATTERS ================= */

const joinedDate = data.created_at
  ? new Date(data.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "—"


        const accountCreated = new Date(
          data.profiles.created_at
        ).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })

        console.log('joinedDate',joinedDate)

        /* 🔥 MAP API → UI MODEL */
        setTechnician({
          id: id.slice(0, 8).toUpperCase(),
          firstName: data.profiles.first_name,
          middleName: data.profiles.middle_name || "",
          lastName: data.profiles.last_name,
          email: data.profiles.email,
          phone: data.profiles.phone,
          profilePhoto: data.profiles.profile_photo,
          status: data.status === "active" ? "Active" : "Inactive",
          approved: data.approval_status === "approved",
          joinedDate,
          location: "—",
          experienceYears: data.experience_years
            ? `${data.experience_years} Years`
            : "N/A",
          promoCode: data.promo_code || "—",
          accountCreated,
          services: (data.services || []).map((s: string) => ({
            name: s,
            icon: "🔧",
          })),
          performance: {
            completedJobs: 0,
            averageRating: 0,
            totalRating: 5,
            totalEarnings: "—",
          },
          documents: {
            aadhaar: data.aadhaar_pan_url,
            pan: data.aadhaar_pan_url,
          },
        })
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTechnician()
  }, [id])

  

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading technician details...
      </div>
    )
  }

  if (error || !technician) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load technician details
      </div>
    )
  }

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className=" bg-gray-50 overflow-auto">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg">
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button> */}
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto sm:px-6 px-2 py-8">
        {/* PROFILE */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex gap-6 items-center">
            <div className="relative">
  <Image
    src={technician.profilePhoto || "/placeholder.svg"}
    alt="Profile"
    width={120}
    height={120}
    className="rounded-full border sm:w-42 sm:h-42 "
  />

  {/* STATUS DOT */}
  <span
    className={`absolute sm:bottom-4 sm:right-2 bottom-3 right-0 w-6 h-6 rounded-full border-2 border-white ${
      technician.status === "Active"
        ? "bg-green-500"
        : "bg-red-500"
    }`}
  />
</div>


            <div>
              <h1 className="sm:text-3xl text-xl font-bold">
                {technician.firstName} {technician.middleName}{" "}
                {technician.lastName}
              </h1>

              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {technician.status}
                </span>

                {technician.approved && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Approved
                  </span>
                )}
              </div>

              <div className="flex gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {technician.joinedDate}
                </div>
                {/* <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {technician.location}
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-8">
            {/* PERSONAL */}
            <Section title="Personal Information">
              <Info label="First Name" value={technician.firstName} />
              <Info label="Middle Name" value={technician.middleName} />
              <Info label="Last Name" value={technician.lastName} />
              <Info label="Phone" value={technician.phone} />
              <Info label="Email" value={technician.email} />
              <Info label="Account Created" value={technician.accountCreated} />
            </Section>

            {/* PROFESSIONAL */}
            <Section title="Professional Details">
              <Info label="Experience" value={technician.experienceYears} />
              <Info label="Promo Code" value={technician.promoCode} />
            </Section>

            {/* DOCUMENT */}
            <Section title="Documents">
              {technician.documents.aadhaar ? (
                <Image
                  src={technician.documents.aadhaar}
                  alt="Document"
                  width={400}
                  height={250}
                  className="rounded-lg border"
                />
              ) : (
                <p className="text-gray-500">No document uploaded</p>
              )}
            </Section>
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2 space-y-8">
            {/* SERVICES */}
            <Section title="Assigned Services">
              <div className="grid grid-cols-2 gap-3 ">
                {technician.services.map((s: any, i: number) => (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
<span className="material-symbols-outlined text-[18px] mr-1.5 w-max">{s.icon}</span>
                                        {s.name}
                                    </span>
                ))}
              </div>

            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= HELPERS ================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase mb-1">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}
