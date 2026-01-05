"use client"

import { ShoppingCart, Star, Check, Shield, Truck, ChevronRight, Heart } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"
import Image from "next/image"
import { getProductById, products } from "../../lib/product-data"

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const product = getProductById(resolvedParams.id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedCapacity, setSelectedCapacity] = useState(product?.capacity || "1.5 Ton")
  const [addInstallation, setAddInstallation] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <main className="container mx-auto px-4 py-12 animate-fade-in">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </main>
      </div>
    )
  }

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <main className="mx-auto max-w-[1320px] px-4 py-6 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#0060ff]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-[#0060ff]">
            Products
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-[#0060ff]">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 xl:gap-12">
          {/* Product Gallery */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative aspect-square w-full overflow-hidden rounded-md border bg-white shadow-sm">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square min-h-[64px] overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:border-[#0060ff] ${i === selectedImage ? "ring-2 ring-[#0060ff]" : ""}`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-md border bg-white p-6 shadow-sm">
              <div className="mb-4 flex gap-2">
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 tracking-wider">
                  {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                </span>
                {product.badge && (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0060ff] tracking-wider">
                    {product.badge.toUpperCase()}
                  </span>
                )}
              </div>

              <h1 className="mb-2 text-2xl font-bold text-slate-900 lg:text-3xl">{product.name}</h1>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                  ))}
                </div>
                <span className="text-xs text-slate-500">({product.reviews} reviews)</span>
              </div>

              <div className="mb-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#0060ff]">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
                    <span className="text-xs font-bold text-emerald-600">
                      Save {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {product.capacity && (
                <div className="mb-6">
                  <span className="mb-3 block text-sm font-medium text-slate-700">Capacity</span>
                  <div className="flex gap-3">
                    {["1.0 Ton", "1.5 Ton", "2.0 Ton"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedCapacity(size)}
                        className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all ${size === selectedCapacity ? "border-[#0060ff] bg-blue-50 text-[#0060ff] ring-1 ring-[#0060ff]" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8 rounded-md border bg-slate-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addInstallation}
                    onChange={(e) => setAddInstallation(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0060ff] focus:ring-[#0060ff]"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-slate-900">Professional Installation</span>
                      <span className="text-sm font-bold text-slate-900">+$50.00</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      Includes unboxing, mounting, and demo by certified Metro Cool experts.
                    </p>
                  </div>
                </label>
              </div>

              <div className="space-y-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0060ff] py-[18px] font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 active:scale-[0.98]">
                  <ShoppingCart className="h-5 w-5" />
                  Purchase Now
                </button>
                <button className="w-full rounded-md border border-slate-200 py-[18px] font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]">
                  Add to Cart
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#0060ff]">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      WARRANTY
                    </span>
                    <span className="text-xs font-bold text-slate-700">5 Years Comp.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#0060ff]">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      DELIVERY
                    </span>
                    <span className="text-xs font-bold text-slate-700">Free Express</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="mb-6 flex overflow-x-auto border-b scrollbar-hide">
            {["Description", "Specifications", `Reviews (${product.reviews})`].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().split(" ")[0])}
                className={`px-6 py-[18px] text-sm font-medium transition-all ${activeTab === tab.toLowerCase().split(" ")[0] ? "border-b-2 border-[#0060ff] text-[#0060ff]" : "text-slate-500 hover:text-slate-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-md border bg-white p-8 shadow-sm">
            {activeTab === "description" && (
              <>
                <h2 className="mb-4 text-xl font-bold text-slate-900">Efficient Cooling for Modern Homes</h2>
                <p className="mb-6 leading-relaxed text-slate-500">{product.description}</p>
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0060ff] text-white">
                        <Check className="h-2 w-2" />
                      </div>
                      <span className="text-sm leading-relaxed text-slate-600">
                        <strong className="text-slate-900">{feature.title}:</strong> {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-600">{spec.label}</span>
                    <span className="text-sm font-bold text-slate-900">{spec.value}</span>
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

                {/* Individual Reviews */}
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">You might also like</h2>
              <Link href="/products" className="text-sm font-bold text-[#0060ff] hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group overflow-hidden rounded-md border bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-6 transition-transform group-hover:scale-105"
                    />
                    {relatedProduct.badge && (
                      <span
                        className={`absolute left-3 top-3 rounded ${relatedProduct.badgeColor} px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider`}
                      >
                        {relatedProduct.badge}
                      </span>
                    )}
                    <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 backdrop-blur-sm transition-all hover:bg-white hover:text-rose-500">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{relatedProduct.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-500">{relatedProduct.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[#0060ff]">${relatedProduct.price.toFixed(2)}</span>
                      {relatedProduct.oldPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ${relatedProduct.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
