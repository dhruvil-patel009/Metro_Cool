"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, DollarSign } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { updateService } from "@/app/lib/services.api";
import { uploadServiceImage } from "@/app/lib/uploadImage";
import { toast } from "sonner";



interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

export function EditServiceModal({
  isOpen,
  onClose,
  service,
}: EditServiceModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [pricingType, setPricingType] =
    useState<"fixed" | "hourly">("fixed");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (!service) return;

    setTitle(service.title);
    setCategory(service.category);
    setPrice(service.price.toString());
    setPricingType(service.pricing_type);
    setDescription(service.description || "");
    setIsActive(service.is_active);
    setImageUrl(service.image_url || null);
  }, [service]);

  if (!isOpen) return null;

  /* ---------------- IMAGE ---------------- */
const handleImageChange = (file: File) => {
  setImageFile(file);
  setImageUrl(URL.createObjectURL(file)); // preview only
};


  /* ---------------- UPDATE ---------------- */
const handleUpdate = async () => {
  try {
    let finalImageUrl = imageUrl;

    if (imageFile) {
      toast.info("📤 Uploading image...");
      finalImageUrl = await uploadServiceImage(imageFile);
    }

    await updateService(service.id, {
      title,
      category,
      price: Number(price),
      pricingType,
      description,
      imageUrl: finalImageUrl,
      isActive,
    });

    toast.success("✅ Service updated successfully!");
    onClose();
  } catch (err: any) {
    toast.error(
      err?.message || "❌ Failed to update service. Please try again."
    );
  }
};


  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Service
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Image */}
          <label className="mb-2 block text-sm font-medium text-gray-700">Service Image</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed p-4 text-center"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                className="h-40 w-full object-cover rounded-lg"
              />
            ) : (
              <>
                <Upload className="mx-auto text-cyan-500" />
                <p className="text-sm text-gray-500">
                  Click to upload image
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              e.target.files &&
              handleImageChange(e.target.files[0])
            }
          />
                <label className="mb-2 block text-sm font-medium text-gray-700">Service Name</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Service Name"
          />

                  <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
          {/* Category Dropdown */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">AC</SelectItem>
              <SelectItem value="Heating">Heating</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Smart Home">Smart Home</SelectItem>
            </SelectContent>
          </Select>

                  <label className="mb-2 block text-sm font-medium text-gray-700 bg-white text-black">Price</label>
                  
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

              {/* Service Status */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Status</p>
                  <p className="text-xs text-gray-500">Inactive services will be hidden from the catalog.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${isActive ? "text-cyan-600" : "text-red-400"}`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-400"
                  />
                </div>
              </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </div>
    </div>
  );
}
