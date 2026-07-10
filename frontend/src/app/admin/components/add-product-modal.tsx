"use client"

import { useState } from "react"
import { Upload, X, Image as ImageIcon, Plus, Package, Tag, FileText, Star, Layers } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Switch } from "@/app/components/ui/switch"
import { createProduct } from "@/app/lib/products.api"
import { toast } from "react-toastify"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AddProductModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  /* ================= STATE ================= */
  const [title, setTitle] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [description, setDescription] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [badge, setBadge] = useState("")
  const [badgeColor, setBadgeColor] = useState("#3b82f6")
  const [inStock, setInStock] = useState(true)
  const [rating, setRating] = useState("4.5")
  const [reviewCount, setReviewCount] = useState("0")
  const [oldPrice, setOldPrice] = useState("")

  const [variants, setVariants] = useState([{ capacity: "1 Ton", price: "" }])
  const [specs, setSpecs] = useState([{ label: "", value: "" }])
  const [featuresList, setFeaturesList] = useState([{ title: "", description: "" }])

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<File[]>([])
  const [gallery, setGallery] = useState<File[]>([])
  const [catalog, setCatalog] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title) { toast.error("Title is required"); return }
    if (variants.some(v => !v.price)) { toast.error("Please enter price for all capacities"); return }
    if (thumbnails.length < 3) { toast.error("Minimum 3 thumbnail images required"); return }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("shortDesc", shortDesc)
      formData.append("description", description)
      formData.append("brand", brand)
      formData.append("category", category)
      formData.append("badge", badge)
      formData.append("badgeColor", badgeColor)
      formData.append("inStock", String(inStock))
      formData.append("rating", rating)
      formData.append("reviewCount", reviewCount)
      formData.append("oldPrice", oldPrice)
      formData.append("capacityPrices", JSON.stringify(variants))
      formData.append("specifications", JSON.stringify(specs))
      formData.append("features", JSON.stringify(featuresList))

      if (mainImage) formData.append("mainImage", mainImage)
      thumbnails.forEach((t) => formData.append("thumbnail", t))
      gallery.forEach((g) => formData.append("gallery", g))
      if (catalog) formData.append("catalog", catalog)

      await createProduct(formData)
      toast.success("Product created successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.message || "Failed to create product")
    } finally {
      setSaving(false)
    }
  }

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl my-4 sm:my-8 flex flex-col max-h-[95vh] sm:max-h-[90vh]">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
              <p className="text-xs text-gray-500">Fill in the details below to create a product</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ─── Scrollable Body ─── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">

          {/* ══════ SECTION: Basic Info ══════ */}
          <SectionHeader icon={<Tag className="w-4 h-4" />} title="Basic Information" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Title" required>
              <Input placeholder="e.g. Daikin 1.5 Ton Split AC" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormField>
            <FormField label="Short Description">
              <Input placeholder="Brief product summary" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
            </FormField>
            <FormField label="Brand">
              <Input placeholder="e.g. Daikin, Voltas, LG" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </FormField>
            <FormField label="Category">
              <Input placeholder="e.g. Split AC, Window AC" value={category} onChange={(e) => setCategory(e.target.value)} />
            </FormField>
          </div>

          <FormField label="Full Description">
            <Textarea
              placeholder="Detailed product description. You can use line breaks for formatting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </FormField>

          {/* ══════ SECTION: Pricing & Capacity ══════ */}
          <SectionHeader icon={<Layers className="w-4 h-4" />} title="Capacity & Pricing" />

          <div className="space-y-3">
            {variants.map((v, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-xl">
                <select
                  value={v.capacity}
                  onChange={(e) => {
                    const updated = [...variants]
                    updated[index].capacity = e.target.value
                    setVariants(updated)
                  }}
                  className="w-full sm:w-36 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>0.8 Ton</option>
                  <option>1 Ton</option>
                  <option>1.5 Ton</option>
                  <option>2 Ton</option>
                  <option>2.5 Ton</option>
                </select>
                <div className="flex-1 w-full">
                  <Input
                    type="number"
                    placeholder="Price in ₹"
                    value={v.price}
                    onChange={(e) => {
                      const updated = [...variants]
                      updated[index].price = e.target.value
                      setVariants(updated)
                    }}
                  />
                </div>
                {variants.length > 1 && (
                  <button
                    onClick={() => setVariants(prev => prev.filter((_, i) => i !== index))}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setVariants([...variants, { capacity: "1 Ton", price: "" }])}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus size={14} /> Add Another Capacity
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="MRP / Old Price (₹)">
              <Input type="number" placeholder="Strike-through price" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} />
            </FormField>
            <FormField label="Rating">
              <Input type="number" step="0.1" min="0" max="5" placeholder="4.5" value={rating} onChange={(e) => setRating(e.target.value)} />
            </FormField>
            <FormField label="Review Count">
              <Input type="number" placeholder="0" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} />
            </FormField>
          </div>

          {/* ══════ SECTION: Badge ══════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Badge Text">
              <Input placeholder="e.g. Best Seller, New" value={badge} onChange={(e) => setBadge(e.target.value)} />
            </FormField>
            <FormField label="Badge Color">
              <div className="flex items-center gap-2 mt-1">
                {["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBadgeColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      badgeColor === color ? "border-gray-800 scale-110" : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </FormField>
          </div>

          {/* ══════ SECTION: Specifications ══════ */}
          <SectionHeader icon={<FileText className="w-4 h-4" />} title="Specifications" />

          <div className="space-y-2">
            {specs.map((s, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Label (e.g. Cooling Capacity)"
                    value={s.label}
                    onChange={(e) => { const u = [...specs]; u[i].label = e.target.value; setSpecs(u) }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Value (e.g. 5200W)"
                    value={s.value}
                    onChange={(e) => { const u = [...specs]; u[i].value = e.target.value; setSpecs(u) }}
                  />
                </div>
                <button
                  onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0 self-start sm:self-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setSpecs([...specs, { label: "", value: "" }])}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus size={14} /> Add Specification
            </button>
          </div>

          {/* ══════ SECTION: Features ══════ */}
          <SectionHeader icon={<Star className="w-4 h-4" />} title="Features" />

          <div className="space-y-2">
            {featuresList.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Feature title"
                    value={f.title}
                    onChange={(e) => { const u = [...featuresList]; u[i].title = e.target.value; setFeaturesList(u) }}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Feature description"
                    value={f.description}
                    onChange={(e) => { const u = [...featuresList]; u[i].description = e.target.value; setFeaturesList(u) }}
                  />
                </div>
                <button
                  onClick={() => setFeaturesList(featuresList.filter((_, idx) => idx !== i))}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors shrink-0 self-start sm:self-center"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setFeaturesList([...featuresList, { title: "", description: "" }])}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus size={14} /> Add Feature
            </button>
          </div>

          {/* ══════ SECTION: Images ══════ */}
          <SectionHeader icon={<ImageIcon className="w-4 h-4" />} title="Images & Files" />

          {/* Main Image */}
          <FormField label="Main Image">
            {mainImage ? (
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt="Main"
                  className="h-36 w-full max-w-[200px] object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setMainImage(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-8 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all max-w-[200px]">
                <ImageIcon className="h-5 w-5" />
                <span>Upload</span>
                <input hidden type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
              </label>
            )}
          </FormField>

          {/* Thumbnails */}
          <FormField label={`Thumbnails (${thumbnails.length} uploaded, min 3)`}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {thumbnails.map((f, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className="h-20 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnails(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-red-500" />
                  </button>
                </div>
              ))}
              <label className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors text-gray-400 hover:text-blue-500">
                <Plus size={18} />
                <input
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setThumbnails(prev => [...prev, ...Array.from(e.target.files || [])])
                    e.target.value = ""
                  }}
                />
              </label>
            </div>
          </FormField>

          {/* Gallery */}
          <FormField label={`Gallery Images (${gallery.length} uploaded)`}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {gallery.map((f, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    className="h-20 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-red-500" />
                  </button>
                </div>
              ))}
              <label className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors text-gray-400 hover:text-blue-500">
                <Plus size={18} />
                <input
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setGallery(prev => [...prev, ...Array.from(e.target.files || [])])
                    e.target.value = ""
                  }}
                />
              </label>
            </div>
          </FormField>

          {/* Catalog PDF */}
          <FormField label="Catalog PDF">
            {catalog ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate flex-1">{catalog.name}</span>
                <button onClick={() => setCatalog(null)} className="text-red-500 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-5 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload PDF Brochure</span>
                <input hidden type="file" accept="application/pdf" onChange={(e) => setCatalog(e.target.files?.[0] || null)} />
              </label>
            )}
          </FormField>

          {/* ══════ SECTION: Stock ══════ */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-gray-800">In Stock</p>
              <p className="text-xs text-gray-500">Product available for purchase</p>
            </div>
            <Switch checked={inStock} onCheckedChange={setInStock} />
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-gray-100 shrink-0">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════ HELPER COMPONENTS ═══════════════ */

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1 border-b border-gray-100">
      <span className="text-blue-600">{icon}</span>
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
