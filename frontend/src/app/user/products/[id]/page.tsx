"use client"

import {
  ShoppingCart,
  Star,
  Check,
  Shield,
  Truck,
  ChevronRight,
  Heart,
  Download,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedCapacity, setSelectedCapacity] = useState("1.5 Ton")
  const [addInstallation, setAddInstallation] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [loading, setLoading] = useState(true)


  const brochureLayoutPlugin = defaultLayoutPlugin({
  sidebarTabs: (defaultTabs) => [
    defaultTabs[0], // thumbnails
  ],
})

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    if (!id) return

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setSelectedCapacity(data.capacity || "1.5 Ton")
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  /* ---------------- FETCH RELATED ---------------- */
  useEffect(() => {
    if (!product?.category) return

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setRelatedProducts(
          data
            .filter(
              (p: any) =>
                p.id !== product.id && p.category === product.category
            )
            .slice(0, 4)
        )
      })
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-semibold">
        Loading product...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    )
  }

  /* ---------------- IMAGES ---------------- */
  const images = [
    product.main_image,
    ...(product.thumbnail_images || []),
    ...(product.gallery_images || []),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="mx-auto max-w-[1320px] px-4 py-6">

        {/* BREADCRUMB */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/user/products">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{product.title}</span>
        </nav>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* GALLERY */}
          <div className="lg:col-span-8">
            <div className="relative aspect-square rounded-md border bg-white">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                fill
                className="p-8"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-md border bg-white ${
                    i === selectedImage ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <Image src={img} alt="" fill className="p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* BUY BOX */}
          <div className="lg:col-span-4">
            <div className="rounded-md border bg-white p-6">

              <div className="mb-4 flex gap-2">
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {product.in_stock ? "IN STOCK" : "OUT OF STOCK"}
                </span>
                {product.badge && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  ({product.review_count || 0} reviews)
                </span>
              </div>

              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.old_price && (
                  <span className="text-sm line-through text-slate-400">
                    ${Number(product.old_price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* CAPACITY */}
              <div className="mb-6">
                <span className="mb-2 block text-sm font-medium">Capacity</span>
                <div className="flex gap-3">
                  {["1.0 Ton", "1.5 Ton", "2.0 Ton"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCapacity(c)}
                      className={`flex-1 rounded-md border py-2 text-xs font-bold ${
                        c === selectedCapacity
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* INSTALLATION */}
              <div className="mb-6 rounded-md border bg-slate-50 p-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addInstallation}
                    onChange={(e) => setAddInstallation(e.target.checked)}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between font-bold">
                      <span>Professional Installation</span>
                      <span>$50.00</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Includes mounting & demo by experts
                    </p>
                  </div>
                </label>
              </div>

              <button className="mb-3 w-full rounded-md bg-blue-600 py-4 font-bold text-white">
                Purchase Now
              </button>
              <button className="w-full rounded-md border py-4 font-bold">
                Add to Cart
              </button>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-6">
                <div className="flex gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold">5 Years Warranty</span>
                </div>
                <div className="flex gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold">Free Delivery</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-12">
          <div className="mb-6 flex border-b">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="rounded-md border bg-white p-8">
            {activeTab === "description" && (
              <p className="text-slate-500">{product.description}</p>
            )}

            {activeTab === "specifications" && (
              <div className="grid md:grid-cols-2 gap-4">
                {(product.specifications || []).map((s: any, i: number) => (
                  <div key={i} className="flex justify-between border-b py-2">
                    <span>{s.label}</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12">
                {/* Rating Summary */}
                <div className="lg:col-span-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-slate-900">{product.rating}</span>
                    <span className="text-slate-400">out of 5</span>
                  </div>
                  <div className="my-3 flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Based on {product.reviews} reviews</p>

                  <div className="mt-6 space-y-2">
                    {[
                      { star: 5, pct: 70 },
                      { star: 4, pct: 20 },
                      { star: 3, pct: 5 },
                      { star: 2, pct: 3 },
                      { star: 1, pct: 2 },
                    ].map((rating) => (
                      <div key={rating.star} className="flex items-center gap-3">
                        <span className="w-2 text-[10px] font-bold text-slate-500">{rating.star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full bg-[#0060ff]" style={{ width: `${rating.pct}%` }}></div>
                        </div>
                        <span className="w-8 text-[10px] font-bold text-slate-400">{rating.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-9">
                  <div className="space-y-8">
                    {[
                      {
                        name: "Marcus Johnson",
                        date: "2 days ago",
                        text: "Absolutely love this AC unit. The installation service from Metro Cool was prompt and professional. The unit itself is incredibly quiet, I sometimes forget it's even on.",
                      },
                      {
                        name: "Sarah Jenkins",
                        date: "1 week ago",
                        text: "Great value for money. Cooling is fast. The only downside is the remote feels a bit plasticky, but the app works perfectly so I use that mostly.",
                      },
                    ].map((review, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border bg-slate-100">
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">{review.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {review.date}
                            </span>
                          </div>
                          <div className="mb-2 flex text-amber-400">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-500">{review.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-10 w-full rounded-md border py-[18px] text-sm font-bold text-slate-600 transition-all hover:bg-slate-50">
                    Load more reviews
                  </button>
                </div>
          </div>
            )}
        </div>
        </div>



        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/user/products/${p.id}`}
                  className="rounded-md border bg-white p-4"
                >
                  <Image
                    src={p.main_image}
                    alt={p.title}
                    width={300}
                    height={200}
                    className="mx-auto"
                  />
                  <h3 className="mt-3 text-sm font-bold">{p.title}</h3>
                  <p className="text-blue-600 font-bold">
                    ${Number(p.price).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

{/* ================= BROCHURE / CATALOG ================= */}
{product.catalog_pdf && (
  <div className="mt-12 rounded-xl border bg-white p-6 shadow-sm">

    {/* HEADER */}
    <h3 className="mb-6 text-lg font-bold text-slate-900">
      Official Product Brochure
    </h3>

    {/* PDF VIEWER */}
    <div className="overflow-hidden rounded-lg border bg-slate-50">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-[520px]">
          <Viewer
            fileUrl={product.catalog_pdf}
            plugins={[brochureLayoutPlugin]}
          />
        </div>
      </Worker>
    </div>

    {/* DOWNLOAD BUTTON */}
    <div className="mt-6 flex justify-center">
      <a
        href={product.catalog_pdf}
        download
        className="flex items-center gap-2 rounded-md border border-blue-600 px-6 py-3 font-bold text-blue-600 transition hover:bg-blue-50"
      >
        <Download className="h-4 w-4" />
        Download Brochure
      </a>
    </div>
  </div>
)}


      </main>
    </div>
  )
}
