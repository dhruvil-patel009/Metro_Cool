"use client";

import { X, Star } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function ProductViewModal({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  const specs = Array.isArray(product.specifications)
    ? product.specifications
    : product.specifications
    ? Object.entries(product.specifications).map(([k, v]) => ({
        label: k,
        value: v,
      }))
    : [];

  const features = Array.isArray(product.features) ? product.features : [];
  const capacityPrices = Array.isArray(product.capacity_prices)
    ? product.capacity_prices
    : [];
  const thumbnails = Array.isArray(product.thumbnail_images)
    ? product.thumbnail_images
    : [];
  const galleryImages = Array.isArray(product.gallery_images)
    ? product.gallery_images
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* MAIN IMAGE */}
          {product.main_image && (
            <img
              src={product.main_image}
              alt={product.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          {/* THUMBNAILS */}
          {thumbnails.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Thumbnails</h4>
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {galleryImages.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Gallery</h4>
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* TITLE & DESCRIPTION */}
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              {product.badge && (
                <span
                  className="text-xs text-white px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: product.badge_color || "#3b82f6" }}
                >
                  {product.badge}
                </span>
              )}
            </div>
            {product.short_desc && (
              <p className="text-gray-500 text-sm mt-1">{product.short_desc}</p>
            )}
            {product.description && (
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {product.description}
              </p>
            )}
          </div>

          {/* META INFO */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold text-lg">₹{product.price}</p>
            </div>
            {product.old_price > 0 && (
              <div>
                <p className="text-gray-500">MRP / Old Price</p>
                <p className="font-medium line-through text-gray-400">
                  ₹{product.old_price}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {product.rating || "—"}{" "}
                {product.review_count > 0 && (
                  <span className="text-gray-400">
                    ({product.review_count} reviews)
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Stock</p>
              <p
                className={`font-medium ${
                  product.in_stock ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            {product.brand && (
              <div>
                <p className="text-gray-500">Brand</p>
                <p className="font-medium">{product.brand}</p>
              </div>
            )}
            {product.category && (
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
            )}
          </div>

          {/* CAPACITY PRICES */}
          {capacityPrices.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">
                Capacity & Prices
              </h4>
              <div className="flex flex-wrap gap-3">
                {capacityPrices.map((cp: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-lg border px-4 py-2 text-sm bg-gray-50"
                  >
                    <span className="font-medium">{cp.capacity}</span>
                    <span className="ml-2 text-blue-600 font-semibold">
                      ₹{cp.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPECIFICATIONS */}
          {specs.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Specifications</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {specs.map((s: any, i: number) => (
                  <div key={i} className="rounded-lg border p-3 bg-gray-50">
                    <span className="font-medium text-gray-700">
                      {s.label}:
                    </span>{" "}
                    <span className="text-gray-600">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURES */}
          {features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">Features</h4>
              <div className="space-y-2">
                {features.map((f: any, i: number) => (
                  <div key={i} className="rounded-lg border p-3 bg-gray-50">
                    <p className="font-medium text-gray-800">{f.title}</p>
                    {f.description && (
                      <p className="text-sm text-gray-500">{f.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF VIEWER */}
          {product.catalog_pdf && (
            <div>
              <h4 className="font-medium mb-2 text-gray-700">
                Product Catalog
              </h4>
              <iframe
                src={product.catalog_pdf}
                className="w-full h-[500px] rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t p-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
