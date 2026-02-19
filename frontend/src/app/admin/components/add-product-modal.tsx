"use client"

import { useState } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
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

  /* ================= BASIC ================= */
  const [title, setTitle] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [rating, setRating] = useState("4.5")
  const [reviewCount, setReviewCount] = useState("0")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [capacity, setCapacity] = useState("")
  const [badge, setBadge] = useState("")
  const [badgeColor, setBadgeColor] = useState("bg-blue-600")
  const [inStock, setInStock] = useState(true)

  /* ================= JSON FIELDS ================= */
  const [specifications, setSpecifications] = useState(
`[
  { "label": "Capacity", "value": "1.5 Ton" },
  { "label": "Energy Rating", "value": "5 Star" }
]`
  )

  const [features, setFeatures] = useState(
`[
  { "title": "Fast Cooling", "description": "Cools in 30 seconds" },
  { "title": "Wi-Fi Control", "description": "Control via mobile app" }
]`
  )

  /* ================= FILES ================= */
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<File[]>([])
  const [gallery, setGallery] = useState<File[]>([])
  const [catalog, setCatalog] = useState<File | null>(null)

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title || !price) {
      toast.error("Title and price are required")
      return
    }

// ✅ JSON validation
try {
  JSON.parse(specifications)
  JSON.parse(features)
} catch {
  toast.error("Specifications / Features must be valid JSON")
  return
}

// ✅ THUMBNAIL VALIDATION (MIN 3)
if (thumbnails.length < 3) {
  toast.error("Minimum 3 thumbnail images are required")
  return
}

    try {
      const formData = new FormData()

      formData.append("title", title)
      formData.append("shortDesc", shortDesc)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("discountPrice", discountPrice)
      formData.append("rating", rating)
      formData.append("reviewCount", reviewCount)
      formData.append("brand", brand)
      formData.append("category", category)
      formData.append("capacity", capacity)
      formData.append("badge", badge)
      formData.append("badgeColor", badgeColor)
      formData.append("inStock", String(inStock))
      formData.append("specifications", specifications)
      formData.append("features", features)

      if (mainImage) formData.append("mainImage", mainImage)
      thumbnails.forEach((t) => formData.append("thumbnail", t))
      gallery.forEach((g) => formData.append("gallery", g))
      if (catalog) formData.append("catalog", catalog)

      await createProduct(formData)

      toast.success("🎉 Product created successfully")
      onClose()
    } catch (err: any) {
      toast.error(err?.message || "Failed to create product")
    }
  }

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[90vh]">

        <h2 className="text-xl font-bold">Add Product</h2>

        {/* BASIC */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Short Description" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
          <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input type="number" placeholder="Discount Price" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />
          <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          <Input placeholder="Badge (Best Seller)" value={badge} onChange={(e) => setBadge(e.target.value)} />
          <Input placeholder="Badge Color (bg-red-500)" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} />
          <Input type="number" placeholder="Rating" value={rating} onChange={(e) => setRating(e.target.value)} />
          <Input type="number" placeholder="Review Count" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} />
        </div>

        <Textarea placeholder="Full Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        {/* JSON FIELDS */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <p className="font-semibold mb-1">Specifications (JSON)</p>
            <Textarea rows={8} value={specifications} onChange={(e) => setSpecifications(e.target.value)} />
          </div>
          <div>
            <p className="font-semibold mb-1">Features (JSON)</p>
            <Textarea rows={8} value={features} onChange={(e) => setFeatures(e.target.value)} />
          </div>
        </div>

        {/* IMAGES */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <ImageUpload label="Main Image" onChange={setMainImage} file={mainImage} />
          <MultiImageUpload label="Thumbnails" files={thumbnails} setFiles={setThumbnails} />
          <MultiImageUpload label="Gallery" files={gallery} setFiles={setGallery} />
        </div>

        {/* PDF */}
{/* PDF */}
<div>
  <p className="font-semibold mb-2">Catalog PDF</p>

  {catalog ? (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-sm">
        <ImageIcon className="h-5 w-5 text-red-500" />
        <span className="font-medium truncate max-w-[240px]">
          {catalog.name}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setCatalog(null)}
        className="text-red-500 hover:text-red-600"
      >
        <X size={16} />
      </button>
    </div>
  ) : (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm text-gray-500 hover:border-blue-400 transition">
      <Upload />
      Upload Catalog PDF
      <input
        hidden
        type="file"
        accept="application/pdf"
        onChange={(e) => setCatalog(e.target.files?.[0] || null)}
      />
    </label>
  )}
</div>

        {/* STOCK */}
        <div className="flex justify-between items-center">
          <span className="font-medium">In Stock</span>
          <Switch checked={inStock} onCheckedChange={setInStock} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Product</Button>
        </div>
      </div>
    </div>
  )
}

/* ================= IMAGE COMPONENTS ================= */

function ImageUpload({ label, file, onChange }: any) {
  return (
    <label className="border-2 border-dashed rounded-xl p-4 cursor-pointer text-center">
      {file ? (
        <img src={URL.createObjectURL(file)} className="h-32 w-full object-cover rounded-lg" />
      ) : (
        <>
          <ImageIcon className="mx-auto text-gray-400" />
          <p className="text-sm">{label}</p>
        </>
      )}
      <input hidden type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} />
    </label>
  )
}

function MultiImageUpload({ label, files, setFiles }: any) {
  return (
    <div>
      <p className="font-medium mb-2">
        {label}{" "}
        <span className="text-xs text-gray-400">
          ({files.length}/3 minimum)
        </span>
      </p>

      <div className="grid grid-cols-4 gap-2">
        {files.map((f: File, i: number) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(f)}
              className="h-20 w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() =>
                setFiles((prev: File[]) =>
                  prev.filter((_, idx) => idx !== i)
                )
              }
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition">
          <Upload />
          <input
            hidden
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || [])
              setFiles((prev: File[]) => [...prev, ...newFiles])
              e.target.value = ""
            }}
          />
        </label>
      </div>
    </div>
  )
}

