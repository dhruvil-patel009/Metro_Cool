"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Package, Plus, HelpCircle, Loader2, CheckSquare, Square } from "lucide-react";
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
import { updateService, getServiceContent, getAllServiceContent, assignContentToService } from "@/app/lib/services.api";
import type { ServiceInclude, ServiceAddon, ServiceFaq } from "@/app/lib/services.api";
import { uploadServiceImage } from "@/app/lib/uploadImage";
import { toast } from "react-toastify";

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
  const [pricingType, setPricingType] = useState<"fixed" | "hourly">("fixed");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [commissionType, setCommissionType] = useState<"percentage" | "flat">("percentage");
  const [commissionValue, setCommissionValue] = useState("10");

  // Service content state
  const [allIncludes, setAllIncludes] = useState<ServiceInclude[]>([]);
  const [allAddons, setAllAddons] = useState<ServiceAddon[]>([]);
  const [allFaqs, setAllFaqs] = useState<ServiceFaq[]>([]);
  const [selectedIncludes, setSelectedIncludes] = useState<Set<string>>(new Set());
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedFaqs, setSelectedFaqs] = useState<Set<string>>(new Set());
  const [contentLoading, setContentLoading] = useState(false);

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
    setCommissionType(service.commission_type || "percentage");
    setCommissionValue((service.commission_value ?? 20).toString());

    // Fetch all available content + this service's current content
    setContentLoading(true);
    Promise.all([getAllServiceContent(), getServiceContent(service.id)])
      .then(([allContent, serviceContent]) => {
        setAllIncludes(allContent.includes || []);
        setAllAddons(allContent.addons || []);
        setAllFaqs(allContent.faqs || []);

        // Pre-select items that are already linked to this service (match by title/question)
        const existingIncludeTitles = new Set(
          (serviceContent.includes || []).map((i: ServiceInclude) => i.title.trim().toLowerCase())
        );
        const existingAddonTitles = new Set(
          (serviceContent.addons || []).map((a: ServiceAddon) => a.title.trim().toLowerCase())
        );
        const existingFaqQuestions = new Set(
          (serviceContent.faqs || []).map((f: ServiceFaq) => f.question.trim().toLowerCase())
        );

        setSelectedIncludes(
          new Set(
            (allContent.includes || [])
              .filter((i: ServiceInclude) => existingIncludeTitles.has(i.title.trim().toLowerCase()))
              .map((i: ServiceInclude) => i.id)
          )
        );
        setSelectedAddons(
          new Set(
            (allContent.addons || [])
              .filter((a: ServiceAddon) => existingAddonTitles.has(a.title.trim().toLowerCase()))
              .map((a: ServiceAddon) => a.id)
          )
        );
        setSelectedFaqs(
          new Set(
            (allContent.faqs || [])
              .filter((f: ServiceFaq) => existingFaqQuestions.has(f.question.trim().toLowerCase()))
              .map((f: ServiceFaq) => f.id)
          )
        );
      })
      .catch(() => {
        setAllIncludes([]);
        setAllAddons([]);
        setAllFaqs([]);
      })
      .finally(() => setContentLoading(false));
  }, [service]);

  if (!isOpen) return null;

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  /* ----------- Commission helpers ----------- */
  const numPrice = Number(price) || 0;
  const numCommission = Number(commissionValue) || 0;
  const adminEarnings =
    commissionType === "percentage"
      ? Math.round(numPrice * (numCommission / 100))
      : Math.min(numCommission, numPrice);
  const technicianPay =
    commissionType === "percentage"
      ? Math.round(numPrice - numPrice * (numCommission / 100))
      : Math.max(0, numPrice - numCommission);

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        toast.info("Uploading image...");
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
        commissionType,
        commissionValue: Number(commissionValue),
      });

      // Assign selected content to the service
      const contentPayload = {
        includes: allIncludes
          .filter((item) => selectedIncludes.has(item.id))
          .map((item) => ({ title: item.title, description: item.description, icon: item.icon })),
        addons: allAddons
          .filter((item) => selectedAddons.has(item.id))
          .map((item) => ({ title: item.title, description: item.description, price: item.price, image: item.image })),
        faqs: allFaqs
          .filter((item) => selectedFaqs.has(item.id))
          .map((item) => ({ question: item.question, answer: item.answer })),
      };
      await assignContentToService(service.id, contentPayload);

      toast.success("Service updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="relative w-full max-w-lg sm:max-w-2xl max-h-[92vh] rounded-2xl bg-white shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Service</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update service details and commission settings</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Service Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Service"
                  className="h-36 sm:h-40 w-full object-cover rounded-lg"
                />
              ) : (
                <div className="py-6">
                  <Upload className="mx-auto h-8 w-8 text-blue-500" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
            />
          </div>

          {/* Service Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Service Name</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Service Name"
              className="h-11 border-gray-300 bg-white text-black"
            />
          </div>

          {/* Category & Price - responsive grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 border-gray-300 bg-white text-black">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AC">AC</SelectItem>
                  <SelectItem value="Heating">Heating</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Smart Home">Smart Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Price (₹)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2000"
                className="h-11 border-gray-300 bg-white text-black"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Service description..."
              rows={4}
              className="resize-y border-gray-300 bg-white text-black"
            />
          </div>

          {/* Commission Configuration */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="18" rx="2" />
                  <path d="M2 9h20" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                Commission Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Commission Type</label>
                <Select value={commissionType} onValueChange={(v) => setCommissionType(v as "percentage" | "flat")}>
                  <SelectTrigger className="h-11 border-gray-300 bg-white text-black">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Commission Value</label>
                <Input
                  type="number"
                  min="0"
                  max={commissionType === "percentage" ? "100" : undefined}
                  step="0.5"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(e.target.value)}
                  placeholder={commissionType === "percentage" ? "e.g. 10" : "e.g. 200"}
                  className="h-11 border-gray-300 focus-visible:ring-blue-500 bg-white text-black"
                />
              </div>
            </div>

            {/* Live Settlement Preview */}
            <div className="rounded-lg border-l-4 border-blue-500 bg-white p-3 sm:p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Live Settlement Preview
              </p>
              {numPrice > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    For{" "}
                    <span className="font-bold text-gray-900">₹{numPrice.toLocaleString("en-IN")}</span>{" "}
                    service at{" "}
                    <span className="font-bold text-blue-600">
                      {commissionType === "percentage"
                        ? `${numCommission}%`
                        : `₹${numCommission.toLocaleString("en-IN")}`}
                    </span>{" "}
                    commission:
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-sm">
                      Admin = <span className="font-bold text-green-600">₹{adminEarnings.toLocaleString("en-IN")}</span>
                    </span>
                    <span className="text-sm">
                      Technician = <span className="font-bold text-blue-700">₹{technicianPay.toLocaleString("en-IN")}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Enter a price to see live preview</p>
              )}
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 shrink-0 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Commission is deducted from technician payment during settlement
            </p>
          </div>

          {/* Service Content Selection */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <Package className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Service Content</h3>
                <p className="text-xs text-gray-500">Select content to show on this service page</p>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
              {contentLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading content...</span>
                </div>
              ) : (allIncludes.length === 0 && allAddons.length === 0 && allFaqs.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No content available. Add content from the Service Content page first.
                </p>
              ) : (
                <>
                  {/* Includes */}
                  {allIncludes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-3.5 w-3.5 text-blue-600" />
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Includes</h4>
                      </div>
                      <div className="space-y-1">
                        {allIncludes.map((item) => {
                          const checked = selectedIncludes.has(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                const next = new Set(selectedIncludes);
                                checked ? next.delete(item.id) : next.add(item.id);
                                setSelectedIncludes(next);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                              {checked
                                ? <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                : <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Addons */}
                  {allAddons.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="h-3.5 w-3.5 text-emerald-600" />
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Add-ons</h4>
                      </div>
                      <div className="space-y-1">
                        {allAddons.map((item) => {
                          const checked = selectedAddons.has(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                const next = new Set(selectedAddons);
                                checked ? next.delete(item.id) : next.add(item.id);
                                setSelectedAddons(next);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                              {checked
                                ? <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                : <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                  <span className="text-xs font-semibold text-emerald-700 ml-2">₹{item.price}</span>
                                </div>
                                {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* FAQs */}
                  {allFaqs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-3.5 w-3.5 text-violet-600" />
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">FAQs</h4>
                      </div>
                      <div className="space-y-1">
                        {allFaqs.map((item) => {
                          const checked = selectedFaqs.has(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                const next = new Set(selectedFaqs);
                                checked ? next.delete(item.id) : next.add(item.id);
                                setSelectedFaqs(next);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                              {checked
                                ? <CheckSquare className="w-4 h-4 text-violet-600 flex-shrink-0" />
                                : <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-800 truncate">{item.question}</p>
                                <p className="text-xs text-gray-500 truncate">{item.answer}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {(selectedIncludes.size > 0 || selectedAddons.size > 0 || selectedFaqs.size > 0) && (
              <div className="px-5 py-3 bg-blue-50 border-t border-blue-100">
                <p className="text-xs text-blue-700 font-medium">
                  Selected: {selectedIncludes.size} includes, {selectedAddons.size} add-ons, {selectedFaqs.size} FAQs
                </p>
              </div>
            )}
          </div>

          {/* Service Status */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Service Status</p>
              <p className="text-xs text-gray-500">Inactive services will be hidden from the catalog.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-red-400"}`}>
                {isActive ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6 sm:py-5">
          <Button variant="outline" onClick={onClose} className="h-10 border-gray-300 bg-white text-black">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="h-10 bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
}
