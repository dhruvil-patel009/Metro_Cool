"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { createProduct } from "@/app/lib/products.api";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [catalog, setCatalog] = useState<File | null>(null);

  if (!isOpen) return null;

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title || !price) {
      toast.error("⚠️ Title and price are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("inStock", String(inStock));

      if (mainImage) formData.append("mainImage", mainImage);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      if (catalog) formData.append("catalog", catalog);
      gallery.forEach((g) => formData.append("gallery", g));

      await createProduct(formData);

      toast.success("🎉 Product created successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "❌ Failed to create product");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Add Product</h2>

        {/* BASIC INFO */}
        <Input placeholder="Product title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        {/* IMAGES */}
        <div className="grid grid-cols-2 gap-4">
          {/* MAIN IMAGE */}
          <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer">
            {mainImage ? (
              <img src={URL.createObjectURL(mainImage)} className="h-32 w-full object-cover rounded-lg" />
            ) : (
              <>
                <Upload className="mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">Main Image</p>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] || null)} />
          </label>

          {/* THUMBNAIL */}
          <label className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer">
            {thumbnail ? (
              <img src={URL.createObjectURL(thumbnail)} className="h-32 w-full object-cover rounded-lg" />
            ) : (
              <>
                <Upload className="mx-auto text-gray-400" />
                <p className="text-sm text-gray-500">Thumbnail</p>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
          </label>
        </div>

        {/* GALLERY */}
        <div>
          <p className="text-sm font-medium mb-2">Gallery Images</p>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(img)} className="h-20 w-full object-cover rounded-lg" />
                <button
                  onClick={() => setGallery((g) => g.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            <label className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
              <Upload />
              <input type="file" hidden multiple accept="image/*" onChange={(e) => setGallery(Array.from(e.target.files || []))} />
            </label>
          </div>
        </div>

        {/* PDF */}
        <div>
          <p className="text-sm font-medium mb-1">Catalog PDF</p>
          {catalog ? (
            <div className="flex items-center gap-2 text-sm">
              <FileText />
              {catalog.name}
            </div>
          ) : (
            <label className="flex items-center gap-2 cursor-pointer text-gray-500">
              <Upload /> Upload PDF
              <input type="file" hidden accept="application/pdf" onChange={(e) => setCatalog(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        {/* STOCK */}
        <div className="flex justify-between items-center">
          <span>In Stock</span>
          <Switch checked={inStock} onCheckedChange={setInStock} />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Product</Button>
        </div>
      </div>
    </div>
  );
}
