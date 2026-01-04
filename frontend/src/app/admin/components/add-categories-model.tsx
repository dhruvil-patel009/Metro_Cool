"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, CloudUpload } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Switch } from "@/app/components/ui/switch"
import Image from "next/image"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (category: { name: string; image: string; isActive: boolean }) => void
}

export function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isActive, setIsActive] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = () => {
    if (categoryName.trim() && imagePreview) {
      onAdd({
        name: categoryName,
        image: imagePreview,
        isActive,
      })
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setCategoryName("")
    setImagePreview(null)
    setImageFile(null)
    setIsActive(true)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new service category for the HVAC platform.</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <Input
              placeholder="e.g. Ventilation Repair"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 bg-gray-100 text-black"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon / Image Upload</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? "border-cyan-500 bg-cyan-50"
                  : imagePreview
                    ? "border-cyan-300 bg-gray-50"
                    : "border-gray-300 hover:border-cyan-400 hover:bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <>
                  <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
                  >
                    Click to upload
                  </button>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-2">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">Status</p>
              <p className="text-xs text-gray-500 mt-0.5">Set visibility for this category</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">{isActive ? "Active" : "Inactive"}</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} className="data-[state=checked]:bg-cyan-500  data-[state=unchecked]:bg-gray-200
" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={handleClose} className="border-gray-300 hover:bg-gray-100 bg-transparent text-black">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!categoryName.trim() || !imagePreview}
            className="bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Category
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
