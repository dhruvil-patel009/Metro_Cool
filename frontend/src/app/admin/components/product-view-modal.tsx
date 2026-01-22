"use client";

import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function ProductViewModal({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-xl font-semibold">
            Product Details
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* IMAGES */}
          <div className="grid grid-cols-4 gap-4">
            {product.main_image && (
              <img
                src={product.main_image}
                className="col-span-4 h-64 object-cover rounded-xl"
              />
            )}

            {product.thumbnail_image && (
              <img
                src={product.thumbnail_image}
                className="h-24 w-full object-cover rounded-lg"
              />
            )}

            {product.gallery_images?.map(
              (img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  className="h-24 w-full object-cover rounded-lg"
                />
              )
            )}
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-lg font-semibold">
              {product.title}
            </h3>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>

          {/* META */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Price:</strong> ₹{product.price}</div>
            <div><strong>Discount:</strong> ₹{product.discount_price || "—"}</div>
            <div><strong>Rating:</strong> {product.rating || "—"}</div>
            <div><strong>Stock:</strong> {product.in_stock ? "In Stock" : "Out"}</div>
          </div>

          {/* SPECIFICATIONS */}
          {product.specifications && (
            <div>
              <h4 className="font-medium mb-2">Specifications</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(product.specifications).map(
                  ([k, v]: any) => (
                    <div
                      key={k}
                      className="rounded-lg border p-2"
                    >
                      <strong>{k}</strong>: {v}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* PDF VIEWER */}
          {product.catalog_pdf && (
            <div>
              <h4 className="font-medium mb-2">
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
