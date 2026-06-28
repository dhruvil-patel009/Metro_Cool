"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { updateProduct } from "@/app/lib/products.api";
import { toast } from "react-toastify";

interface Props {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: any) => void;
}

export function EditProductModal({ product, isOpen, onClose, onUpdated }: Props) {
  if (!isOpen || !product) return null;

  /* ================= BASIC ================= */
  const [title, setTitle] = useState(product.title || "");
  const [shortDesc, setShortDesc] = useState(product.short_desc || "");
  const [description, setDescription] = useState(product.description || "");
  const [brand, setBrand] = useState(product.brand || "");
  const [category, setCategory] = useState(product.category || "");
  const [badge, setBadge] = useState(product.badge || "");
  const [badgeColor, setBadgeColor] = useState(product.badge_color || "#3b82f6");
  const [inStock, setInStock] = useState(product.in_stock ?? true);
  const [rating, setRating] = useState(String(product.rating || "0"));
  const [reviewCount, setReviewCount] = useState(String(product.review_count || "0"));
  const [oldPrice, setOldPrice] = useState(String(product.old_price || ""));

  /* ================= VARIANTS ================= */
  const [variants, setVariants] = useState(
    Array.isArray(product.capacity_prices) && product.capacity_prices.length > 0
      ? product.capacity_prices.map((cp: any) => ({
          capacity: cp.capacity,
          price: String(cp.price),
        }))
      : [{ capacity: "1 Ton", price: String(product.price || "") }]
  );

  /* ================= SPECIFICATIONS ================= */
  const [specs, setSpecs] = useState(
    Array.isArray(product.specifications) && product.specifications.length > 0
      ? product.specifications
      : [{ label: "", value: "" }]
  );

  /* ================= FEATURES ================= */
  const [featuresList, setFeaturesList] = useState(
    Array.isArray(product.features) && product.features.length > 0
      ? product.features
      : [{ title: "", description: "" }]
  );

  /* ================= FILES ================= */
  // Existing images (URLs from server)
  const [existingMainImage, setExistingMainImage] = useState<string | null>(
    product.main_image || null
  );
  const [existingThumbnails, setExistingThumbnails] = useState<string[]>(
    Array.isArray(product.thumbnail_images) ? product.thumbnail_images : []
  );
  const [existingGallery, setExistingGallery] = useState<string[]>(
    Array.isArray(product.gallery_images) ? product.gallery_images : []
  );
  const [existingCatalog, setExistingCatalog] = useState<string | null>(
    product.catalog_pdf || null
  );

  // New files to upload
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newThumbnails, setNewThumbnails] = useState<File[]>([]);
  const [newGallery, setNewGallery] = useState<File[]>([]);
  const [newCatalog, setNewCatalog] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (variants.some((v: any) => !v.price)) {
      toast.error("Please enter price for all capacities");
      return;
    }

    setSaving(true);
    try {
      const basePrice = Math.min(...variants.map((v: any) => Number(v.price)));

      const formData = new FormData();

      formData.append("title", title);
      formData.append("short_desc", shortDesc);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("badge", badge);
      formData.append("badge_color", badgeColor);
      formData.append("in_stock", String(inStock));
      formData.append("rating", rating);
      formData.append("review_count", reviewCount);
      formData.append("old_price", oldPrice || "0");
      formData.append("price", String(basePrice));
      formData.append("capacityPrices", JSON.stringify(variants));
      formData.append("specifications", JSON.stringify(specs.filter((s: any) => s.label)));
      formData.append("features", JSON.stringify(featuresList.filter((f: any) => f.title)));

      // Existing images that are still kept
      formData.append("existing_thumbnails", JSON.stringify(existingThumbnails));
      formData.append("existing_gallery", JSON.stringify(existingGallery));

      // New file uploads
      if (newMainImage) formData.append("mainImage", newMainImage);
      newThumbnails.forEach((t) => formData.append("thumbnail", t));
      newGallery.forEach((g) => formData.append("gallery", g));
      if (newCatalog) formData.append("catalog", newCatalog);

      const result: any = await updateProduct(product.id, formData);
      toast.success("✅ Product updated successfully");
      onUpdated(result?.product || { ...product, title, price: basePrice });
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold">Edit Product</h2>

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
            {["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBadgeColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  badgeColor === color ? "border-black" : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <Textarea
          placeholder="Product description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* VARIANTS */}
        <div>
          <p className="font-semibold mb-2">Capacity & Price</p>
          {variants.map((v: any, index: number) => (
            <div key={index} className="flex gap-3 mb-2">
              <select
                value={v.capacity}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[index].capacity = e.target.value;
                  setVariants(updated);
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
                onChange={(e) => {
                  const updated = [...variants];
                  updated[index].price = e.target.value;
                  setVariants(updated);
                }}
              />

              <button onClick={() => setVariants((prev: any[]) => prev.filter((_, i) => i !== index))}>
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setVariants([...variants, { capacity: "1 Ton", price: "" }])}
            className="text-blue-600 text-sm font-semibold"
          >
            + Add Capacity
          </button>
        </div>

        {/* SPECIFICATIONS */}
        <div>
          <p className="font-semibold mb-2">Specifications</p>
          {specs.map((s: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                placeholder="Label"
                value={s.label}
                onChange={(e) => {
                  const u = [...specs];
                  u[i].label = e.target.value;
                  setSpecs(u);
                }}
              />
              <Input
                placeholder="Value"
                value={s.value}
                onChange={(e) => {
                  const u = [...specs];
                  u[i].value = e.target.value;
                  setSpecs(u);
                }}
              />
              <button onClick={() => setSpecs(specs.filter((_: any, idx: number) => idx !== i))}>
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setSpecs([...specs, { label: "", value: "" }])}
            className="text-blue-600 text-sm"
          >
            + Add Specification
          </button>
        </div>

        {/* FEATURES */}
        <div>
          <p className="font-semibold mb-2">Features</p>
          {featuresList.map((f: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                placeholder="Feature title"
                value={f.title}
                onChange={(e) => {
                  const u = [...featuresList];
                  u[i].title = e.target.value;
                  setFeaturesList(u);
                }}
              />
              <Input
                placeholder="Description"
                value={f.description}
                onChange={(e) => {
                  const u = [...featuresList];
                  u[i].description = e.target.value;
                  setFeaturesList(u);
                }}
              />
              <button onClick={() => setFeaturesList(featuresList.filter((_: any, idx: number) => idx !== i))}>
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setFeaturesList([...featuresList, { title: "", description: "" }])}
            className="text-blue-600 text-sm"
          >
            + Add Feature
          </button>
        </div>

        {/* ================= IMAGES SECTION ================= */}
        <div className="space-y-4">
          <p className="font-semibold text-lg">Images & Files</p>

          {/* MAIN IMAGE */}
          <div>
            <p className="font-medium mb-2">Main Image</p>
            {newMainImage ? (
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(newMainImage)}
                  className="h-40 w-full max-w-xs object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => setNewMainImage(null)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </div>
            ) : existingMainImage ? (
              <div className="relative inline-block">
                <img
                  src={existingMainImage}
                  className="h-40 w-full max-w-xs object-cover rounded-xl border"
                />
                <button
                  type="button"
                  onClick={() => setExistingMainImage(null)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-sm text-gray-500 hover:border-blue-400 transition max-w-xs">
                <ImageIcon className="h-5 w-5" />
                Upload Main Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewMainImage(e.target.files?.[0] || null)}
                />
              </label>
            )}
            {(existingMainImage || newMainImage) && (
              <label className="inline-block mt-2 cursor-pointer text-blue-600 text-sm font-medium hover:underline">
                Replace Image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewMainImage(file);
                      setExistingMainImage(null);
                    }
                  }}
                />
              </label>
            )}
          </div>

          {/* THUMBNAILS */}
          <div>
            <p className="font-medium mb-2">
              Thumbnails{" "}
              <span className="text-xs text-gray-400">
                ({existingThumbnails.length + newThumbnails.length} images)
              </span>
            </p>
            <div className="grid grid-cols-5 gap-3">
              {/* Existing thumbnails */}
              {existingThumbnails.map((url, i) => (
                <div key={`existing-${i}`} className="relative">
                  <img
                    src={url}
                    className="h-20 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingThumbnails((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* New thumbnails */}
              {newThumbnails.map((f, i) => (
                <div key={`new-${i}`} className="relative">
                  <img
                    src={URL.createObjectURL(f)}
                    className="h-20 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewThumbnails((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              <label className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition text-gray-400">
                <Upload size={18} />
                <input
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setNewThumbnails((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {/* GALLERY */}
          <div>
            <p className="font-medium mb-2">
              Gallery{" "}
              <span className="text-xs text-gray-400">
                ({existingGallery.length + newGallery.length} images)
              </span>
            </p>
            <div className="grid grid-cols-5 gap-3">
              {/* Existing gallery */}
              {existingGallery.map((url, i) => (
                <div key={`existing-${i}`} className="relative">
                  <img
                    src={url}
                    className="h-20 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* New gallery */}
              {newGallery.map((f, i) => (
                <div key={`new-${i}`} className="relative">
                  <img
                    src={URL.createObjectURL(f)}
                    className="h-20 w-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewGallery((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              <label className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition text-gray-400">
                <Upload size={18} />
                <input
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setNewGallery((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {/* CATALOG PDF */}
          <div>
            <p className="font-medium mb-2">Catalog PDF</p>
            {newCatalog ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3">
                <span className="font-medium truncate max-w-[240px]">
                  {newCatalog.name}
                </span>
                <button type="button" onClick={() => setNewCatalog(null)} className="text-red-500">
                  <X size={16} />
                </button>
              </div>
            ) : existingCatalog ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-slate-50 p-3">
                <a
                  href={existingCatalog}
                  target="_blank"
                  className="text-cyan-600 hover:underline text-sm truncate max-w-[240px]"
                >
                  📄 View Current PDF
                </a>
                <div className="flex gap-2">
                  <label className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                    Replace
                    <input
                      hidden
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewCatalog(file);
                          setExistingCatalog(null);
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setExistingCatalog(null)}
                    className="text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm text-gray-500 hover:border-blue-400 transition">
                <Upload />
                Upload Catalog PDF
                <input
                  hidden
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setNewCatalog(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
        </div>

        {/* STOCK */}
        <div className="flex justify-between items-center">
          <span className="font-medium">In Stock</span>
          <Switch checked={inStock} onCheckedChange={setInStock} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-900"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
