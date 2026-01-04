"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, DollarSign } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Switch } from "@/app/components/ui/switch"
import { Textarea } from "@/app/components/ui/textarea"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  const [serviceName, setServiceName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [priceType, setPriceType] = useState("fixed")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [serviceImage, setServiceImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setServiceImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleSubmit = () => {
    // Validate form
    if (!serviceName || !category || !price || !serviceImage) {
      alert("Please fill in all required fields")
      return
    }

    // Handle service creation logic here
    console.log("[v0] Creating service:", {
      serviceName,
      category,
      price,
      priceType,
      description,
      isActive,
      serviceImage,
    })

    // Reset form and close modal
    handleClose()
  }

  const handleClose = () => {
    setServiceName("")
    setCategory("")
    setPrice("")
    setPriceType("fixed")
    setDescription("")
    setIsActive(true)
    setServiceImage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl bg-white shadow-xl">
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Service</h2>
              <p className="mt-1 text-sm text-gray-500">Fill in the details to create a new HVAC service.</p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Service Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Service Image</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                    isDragging
                      ? "border-cyan-500 bg-cyan-50"
                      : serviceImage
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-300 bg-gray-50 hover:border-cyan-400 hover:bg-cyan-50/50"
                  }`}
                >
                  {serviceImage ? (
                    <div className="relative w-full">
                      <img
                        src={serviceImage || "/placeholder.svg"}
                        alt="Service preview"
                        className="h-40 w-full rounded-lg object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setServiceImage(null)
                        }}
                        className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-red-50"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-3 h-10 w-10 text-cyan-500" />
                      <p className="text-sm font-medium text-cyan-600">Click to upload or drag and drop</p>
                      <p className="mt-1 text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Service Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Service Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Annual AC Maintenance"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="h-11 border-gray-300 focus-visible:ring-cyan-500 bg-white text-black"
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 border-gray-300 bg-white text-black">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac-repair">AC Repair</SelectItem>
                      <SelectItem value="heating">Heating</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="smart-home">Smart Home</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 bg-white text-black">Price</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-11 border-gray-300 pl-9 focus-visible:ring-cyan-500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant={priceType === "fixed" ? "default" : "outline"}
                      onClick={() => setPriceType(priceType === "fixed" ? "hourly" : "fixed")}
                      className={`h-11 px-4 ${priceType === "fixed" ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300"}`}
                    >
                      {priceType === "fixed" ? "Fixed" : "Hourly"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  placeholder="Briefly describe what this service includes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-none border-gray-300 focus-visible:ring-cyan-500 bg-white text-black"
                />
              </div>

              {/* Service Status */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Status</p>
                  <p className="text-xs text-gray-500">Inactive services will be hidden from the catalog.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${isActive ? "text-cyan-600" : "text-gray-400"}`}>
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
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
            <Button onClick={handleClose} variant="outline" className="h-10 border-gray-300 bg-transparent bg-white text-black">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="h-10 bg-cyan-500 hover:bg-cyan-600">
              Create Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
