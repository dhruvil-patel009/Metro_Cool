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
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [badge, setBadge] = useState("")
  const [badgeColor, setBadgeColor] = useState("#3b82f6")
  const [inStock, setInStock] = useState(true)

  /* ================= VARIANTS ================= */
  const [variants, setVariants] = useState([
    { capacity: "1 Ton", price: "" },
  ])

  /* ================= SPECIFICATIONS ================= */
  const [specs, setSpecs] = useState([{ label: "", value: "" }])

  /* ================= FEATURES ================= */
  const [featuresList, setFeaturesList] = useState([
    { title: "", description: "" },
  ])

  /* ================= FILES ================= */
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [thumbnails, setThumbnails] = useState<File[]>([])
  const [gallery, setGallery] = useState<File[]>([])
  const [catalog, setCatalog] = useState<File | null>(null)

  /* ================= PRICING & REVIEW ================= */
const [rating, setRating] = useState("4.5")
const [reviewCount, setReviewCount] = useState("0")
const [oldPrice, setOldPrice] = useState("")

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (!title) {
      toast.error("Title is required")
      return
    }

    if (variants.some(v => !v.price)) {
      toast.error("Please enter price for all capacities")
      return
    }

    if (thumbnails.length < 3) {
      toast.error("Minimum 3 thumbnail images required")
      return
    }

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
          <Input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input placeholder="Badge (Best Seller)" value={badge} onChange={(e) => setBadge(e.target.value)} />
          <Input
  type="number"
  step="0.1"
  min="0"
  max="5"
  placeholder="Rating (ex: 4.5)"
  value={rating}
  onChange={(e) => setRating(e.target.value)}
/>

<Input
  type="number"
  placeholder="Review Count (ex: 120)"
  value={reviewCount}
  onChange={(e) => setReviewCount(e.target.value)}
/>

<Input
  type="number"
  placeholder="Old Price / MRP ₹ (for strike price)"
  value={oldPrice}
  onChange={(e) => setOldPrice(e.target.value)}
/>
        </div>

        {/* BADGE COLOR */}
        <div>
          <p className="font-semibold mb-2">Badge Color</p>
          <div className="flex gap-3">
            {["#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6"].map(color=>(
              <button
                key={color}
                type="button"
                onClick={()=>setBadgeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${badgeColor===color?"border-black":"border-gray-200"}`}
                style={{backgroundColor:color}}
              />
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <Textarea
          placeholder={`Example:
1. Fast cooling
2. Energy efficient
**Copper condenser**
- Anti dust filter`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* VARIANTS */}
        <div>
          <p className="font-semibold mb-2">Capacity & Price</p>

          {variants.map((v,index)=>(
            <div key={index} className="flex gap-3 mb-2">
              <select
                value={v.capacity}
                onChange={(e)=>{
                  const updated=[...variants]
                  updated[index].capacity=e.target.value
                  setVariants(updated)
                }}
                className="border rounded-md p-2 w-40"
              >
                <option>1 Ton</option>
                <option>1.5 Ton</option>
                <option>2 Ton</option>
                <option>2.5 Ton</option>
              </select>

              <Input
                type="number"
                placeholder="Price ₹"
                value={v.price}
                onChange={(e)=>{
                  const updated=[...variants]
                  updated[index].price=e.target.value
                  setVariants(updated)
                }}
              />

              <button onClick={()=>setVariants(prev=>prev.filter((_,i)=>i!==index))}>
                <X size={16}/>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={()=>setVariants([...variants,{capacity:"1 Ton",price:""}])}
            className="text-blue-600 text-sm font-semibold"
          >
            + Add Capacity
          </button>
        </div>

        {/* SPECIFICATIONS */}
        <div>
          <p className="font-semibold mb-2">Specifications</p>
          {specs.map((s,i)=>(
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Label" value={s.label}
                onChange={e=>{
                  const u=[...specs];u[i].label=e.target.value;setSpecs(u)
                }}
              />
              <Input placeholder="Value" value={s.value}
                onChange={e=>{
                  const u=[...specs];u[i].value=e.target.value;setSpecs(u)
                }}
              />
              <button onClick={()=>setSpecs(specs.filter((_,idx)=>idx!==i))}>
                <X size={16}/>
              </button>
            </div>
          ))}
          <button onClick={()=>setSpecs([...specs,{label:"",value:""}])} className="text-blue-600 text-sm">
            + Add Specification
          </button>
        </div>

        {/* FEATURES */}
        <div>
          <p className="font-semibold mb-2">Features</p>
          {featuresList.map((f,i)=>(
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Feature title" value={f.title}
                onChange={e=>{
                  const u=[...featuresList];u[i].title=e.target.value;setFeaturesList(u)
                }}
              />
              <Input placeholder="Description" value={f.description}
                onChange={e=>{
                  const u=[...featuresList];u[i].description=e.target.value;setFeaturesList(u)
                }}
              />
              <button onClick={()=>setFeaturesList(featuresList.filter((_,idx)=>idx!==i))}>
                <X size={16}/>
              </button>
            </div>
          ))}
          <button onClick={()=>setFeaturesList([...featuresList,{title:"",description:""}])} className="text-blue-600 text-sm">
            + Add Feature
          </button>
        </div>

        {/* IMAGES + PDF (your original components stay same below) */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
          <ImageUpload label="Main Image" onChange={setMainImage} file={mainImage} />
          <MultiImageUpload label="Thumbnails" files={thumbnails} setFiles={setThumbnails} />
          <MultiImageUpload label="Gallery" files={gallery} setFiles={setGallery} />
        </div>

        {/* PDF */}
        <div>
          <p className="font-semibold mb-2">Catalog PDF</p>

          {catalog ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3">
              <span className="font-medium truncate max-w-[240px]">
                {catalog.name}
              </span>
              <button type="button" onClick={() => setCatalog(null)} className="text-red-500">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm text-gray-500 hover:border-blue-400 transition">
              <Upload />
              Upload Catalog PDF
              <input hidden type="file" accept="application/pdf" onChange={(e) => setCatalog(e.target.files?.[0] || null)} />
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
          <Button className="bg-blue-600 hover:bg-blue-900" onClick={handleSubmit}>Create Product</Button>
        </div>

      </div>
    </div>
  )
}


/* ================= IMAGE COMPONENTS ================= */

function ImageUpload({ label, file, onChange }: any) {
  return (
    <label className="border-2 border-dashed rounded-xl p-4 cursor-pointer text-center block">
      {file ? (
        <img
          src={URL.createObjectURL(file)}
          className="h-32 w-full object-cover rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageIcon />
          <p className="text-sm">{label}</p>
        </div>
      )}

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
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

        {/* Existing Images */}
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
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        <label className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition text-gray-400">
          <Upload size={18} />
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