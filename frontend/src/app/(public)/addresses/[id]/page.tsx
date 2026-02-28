"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function EditAddressPage() {
const router = useRouter()
const params = useParams()
const id = params.id as string

const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)

const [form, setForm] = useState<any>({
label: "Home",
full_name: "",
phone: "",
street: "",
apartment: "",
city: "",
state: "",
postal_code: "",
is_default: false,
})

/* ================= FETCH ADDRESS ================= */
useEffect(() => {
const fetchAddress = async () => {
const token = localStorage.getItem("accessToken")
if (!token) return router.push("/auth/login")


  try {
    const res = await fetch(`${API_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()

    const addr = data.addresses.find((a: any) => a.id === id)
    if (!addr) return router.push("/profile/addresses")

    setForm(addr)
  } catch {
    alert("Failed to load address")
  } finally {
    setLoading(false)
  }
}

fetchAddress()


}, [id])

const handleChange = (e: any) => {
setForm({ ...form, [e.target.name]: e.target.value })
}

/* ================= UPDATE ================= */
const handleSubmit = async (e: any) => {
e.preventDefault()


const token = localStorage.getItem("accessToken")
if (!token) return

setSaving(true)

try {
  const res = await fetch(`${API_URL}/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message)

  router.push("/profile/addresses")
  router.refresh()
} catch (err: any) {
  alert(err.message)
} finally {
  setSaving(false)
}


}

if (loading) return <div className="loader-wrapper">
  <div className="loader"></div>
</div>

return ( <div className="min-h-screen bg-gray-50 py-10"> <div className="max-w-2xl mx-auto px-4">


    <Link href="/profile/addresses" className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-blue-600">
      <ChevronLeft className="w-4 h-4" />
      Back to addresses
    </Link>

    <div className="bg-white rounded-2xl shadow-sm border p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Address</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Full Name"/>
        <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Phone"/>
        <input name="apartment" value={form.apartment} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" placeholder="Apartment"/>
        <input name="street" value={form.street} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Street Address"/>
        <input name="city" value={form.city} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="City"/>
        <input name="state" value={form.state} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="State"/>
        <input name="postal_code" value={form.postal_code} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Postal Code"/>

        <button
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {saving ? "Updating..." : "Update Address"}
        </button>

      </form>
    </div>
  </div>
</div>


)
}
