"use client"

import { useEffect, useRef, useState } from "react"
import {
  CheckSquare, Square, Loader2, Plus, HelpCircle, Package,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { AdminPageShell } from "../../components/admin-page-shell"
import { toast } from "react-toastify"

const API = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function ServiceContentPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceIds, setServiceIds] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [include, setInclude] = useState({ title: "", description: "", icon: "SearchCheck" })
  const [addon, setAddon] = useState({ title: "", description: "", price: "", image: "" })
  const [faq, setFaq] = useState({ question: "", answer: "" })
  const [addonFile, setAddonFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/service-content/list`)
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false))
  }, [])

  const toggleService = (id: string) => {
    setServiceIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const addInclude = async () => {
    if (serviceIds.length === 0) return toast.warn("Select at least one service")
    setSubmitting("include")
    try {
      const res = await fetch(`${API}/service-content/include`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_ids: serviceIds, ...include }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Include added to selected services")
      setInclude({ title: "", description: "", icon: "SearchCheck" })
    } catch (e: any) {
      toast.error(e.message || "Failed to add include")
    } finally {
      setSubmitting(null)
    }
  }

  const addAddon = async () => {
    if (serviceIds.length === 0) return toast.warn("Select at least one service")
    if (!addon.title.trim() || !addon.price) return toast.warn("Fill in title and price")
    setSubmitting("addon")
    try {
      const formData = new FormData()
      formData.append("service_ids", JSON.stringify(serviceIds))
      formData.append("title", addon.title)
      formData.append("description", addon.description)
      formData.append("price", addon.price)
      if (addonFile) formData.append("image", addonFile)

      const res = await fetch(`${API}/service-content/addon`, { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Addon added!")
      setAddon({ title: "", description: "", price: "", image: "" })
      setAddonFile(null)
      if (fileRef.current) fileRef.current.value = ""
    } catch (e: any) {
      toast.error(e.message || "Failed to add addon")
    } finally {
      setSubmitting(null)
    }
  }

  const addFaq = async () => {
    if (serviceIds.length === 0) return toast.warn("Select at least one service")
    if (!faq.question.trim() || !faq.answer.trim()) return toast.warn("Fill in question and answer")
    setSubmitting("faq")
    try {
      const res = await fetch(`${API}/service-content/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_ids: serviceIds, ...faq }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("FAQ added")
      setFaq({ question: "", answer: "" })
    } catch (e: any) {
      toast.error(e.message || "Failed to add FAQ")
    } finally {
      setSubmitting(null)
    }
  }

  const SectionCard = ({
    icon, title, description, children, onSubmit, submitLabel, submitColor, type,
  }: {
    icon: React.ReactNode; title: string; description: string
    children: React.ReactNode; onSubmit: () => void; submitLabel: string
    submitColor: string; type: string
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">{icon}</div>
        <div>
          <h2 className="font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <Button
          className={`${submitColor} text-white`}
          onClick={onSubmit}
          disabled={submitting === type}
        >
          {submitting === type ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {submitLabel}
        </Button>
      </div>
    </div>
  )

  return (
    <AdminPageShell
      title="Service Content"
      description="Add includes, add-ons, and FAQs to your services."
    >
      {/* Service selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Select Services</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {serviceIds.length} of {services.length} selected
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setServiceIds(serviceIds.length === services.length ? [] : services.map(s => s.id))
            }
          >
            {serviceIds.length === services.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl max-h-56 overflow-y-auto divide-y divide-gray-50">
            {services.map(s => {
              const checked = serviceIds.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {checked
                    ? <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    : <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                  <span className="text-sm font-medium text-gray-800">{s.title}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
        <SectionCard
          icon={<Package className="w-5 h-5 text-blue-600" />}
          title="What's Included"
          description="List items included in the service"
          onSubmit={addInclude}
          submitLabel="Add Include"
          submitColor="bg-blue-600 hover:bg-blue-700"
          type="include"
        >
          <Input placeholder="Title" value={include.title} onChange={e => setInclude({ ...include, title: e.target.value })} className="text-gray-900" />
          <Input placeholder="Description" value={include.description} onChange={e => setInclude({ ...include, description: e.target.value })} className="text-gray-900" />
          <Input placeholder="Icon name (SearchCheck, Droplets…)" value={include.icon} onChange={e => setInclude({ ...include, icon: e.target.value })} className="text-gray-900" />
        </SectionCard>

        <SectionCard
          icon={<Plus className="w-5 h-5 text-emerald-600" />}
          title="Add-on"
          description="Optional paid extras for the service"
          onSubmit={addAddon}
          submitLabel="Add Addon"
          submitColor="bg-emerald-600 hover:bg-emerald-700"
          type="addon"
        >
          <Input placeholder="Title" value={addon.title} onChange={e => setAddon({ ...addon, title: e.target.value })} className="text-gray-900" />
          <Input placeholder="Description" value={addon.description} onChange={e => setAddon({ ...addon, description: e.target.value })} className="text-gray-900" />
          <Input placeholder="Price (₹)" value={addon.price} onChange={e => setAddon({ ...addon, price: e.target.value })} className="text-gray-900" />
          <input ref={fileRef} type="file" accept="image/*" onChange={e => setAddonFile(e.target.files?.[0] || null)} className="text-sm text-gray-600" />
        </SectionCard>

        <SectionCard
          icon={<HelpCircle className="w-5 h-5 text-violet-600" />}
          title="FAQ"
          description="Common questions about the service"
          onSubmit={addFaq}
          submitLabel="Add FAQ"
          submitColor="bg-violet-600 hover:bg-violet-700"
          type="faq"
        >
          <Input placeholder="Question" value={faq.question} onChange={e => setFaq({ ...faq, question: e.target.value })} className="text-gray-900" />
          <textarea
            className="w-full min-h-[100px] rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Answer"
            value={faq.answer}
            onChange={e => setFaq({ ...faq, answer: e.target.value })}
          />
        </SectionCard>
      </div>
    </AdminPageShell>
  )
}
