"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Home, Briefcase, MapPin } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function NewAddressPage() {
const router = useRouter()

const [loading, setLoading] = useState(false)

const [form, setForm] = useState({
label: "Home",
full_name: "",
phone: "",
street: "",
apartment: "",
city: "",
state: "",
postal_code: "",
is_default: true,
})

const handleChange = (e: any) => {
setForm({ ...form, [e.target.name]: e.target.value })
}

const handleSubmit = async (e: any) => {
e.preventDefault()

const token = localStorage.getItem("accessToken")
if (!token) return router.push("/auth/login")

setLoading(true)

try {
  const res = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message)

  // success → go back to address list
  router.push("/profile/addresses")
  router.refresh()

} catch (err: any) {
  alert(err.message || "Failed to create address")
} finally {
  setLoading(false)
}

}

return ( <div className="min-h-screen bg-gray-50 py-10"> <div className="max-w-2xl mx-auto px-4">

    <Link href="/profile/addresses" className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-blue-600">
      <ChevronLeft className="w-4 h-4" />
      Back to addresses
    </Link>

    <div className="bg-white rounded-2xl shadow-sm border p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Address</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Label */}
        <div>
          <label className="text-sm font-medium">Address Type</label>
          <select
            name="label"
            value={form.label}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

{/* Apartment */}
        <div>
          <label className="text-sm font-medium">Apartment / Landmark</label>
          <input
            name="apartment"
            value={form.apartment}
            onChange={handleChange}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>
        {/* Street */}
        <div>
          <label className="text-sm font-medium">Street Address</label>
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

        </div>

        <div>
          <label className="text-sm font-medium">Postal Code</label>
          <input
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            required
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e)=>setForm({...form, is_default:e.target.checked})}
          />
          <span className="text-sm">Make this default address</span>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>

      </form>
    </div>
  </div>
</div>

)
}
