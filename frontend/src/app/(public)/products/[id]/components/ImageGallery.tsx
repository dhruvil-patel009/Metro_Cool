"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
  discount?: number
}

export function ImageGallery({ images, title, discount }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  // Zoom on hover (desktop)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return
    const rect = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }, [])

  const handleMouseEnter = () => setIsZooming(true)
  const handleMouseLeave = () => setIsZooming(false)

  // Navigation
  const goNext = useCallback(() => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Touch/swipe for fullscreen
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    setTouchStart(null)
  }

  // Keyboard navigation in fullscreen
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "Escape") setIsFullscreen(false)
    },
    [goNext, goPrev]
  )

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 lg:border-r border-gray-100">
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">

          {/* ===== THUMBNAILS (vertical on desktop, horizontal on mobile) ===== */}
          {images.length > 1 && (
            <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[500px] hide-scrollbar shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  onMouseEnter={() => setSelectedImage(i)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] shrink-0 rounded-lg border-2 bg-white overflow-hidden transition-all duration-200 cursor-pointer ${
                    i === selectedImage
                      ? "border-blue-600 shadow-md shadow-blue-100"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${title} - Image ${i + 1}`}
                    fill
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}

          {/* ===== MAIN IMAGE ===== */}
          <div className="order-1 lg:order-2 flex-1 relative">
            <div
              ref={mainImageRef}
              className="relative aspect-square rounded-xl sm:rounded-2xl bg-white border border-gray-100 overflow-hidden cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsFullscreen(true)}
            >
              {/* Normal Image */}
              <Image
                src={images[selectedImage]}
                alt={title}
                fill
                className={`object-contain p-4 sm:p-8 transition-opacity duration-200 ${
                  isZooming ? "opacity-0" : "opacity-100"
                }`}
                priority
              />

              {/* Zoomed Image (shown on hover) */}
              {isZooming && (
                <div
                  className="absolute inset-0 hidden sm:block"
                  style={{
                    backgroundImage: `url(${images[selectedImage]})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: "200%",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}

              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Click to expand</span>
              </div>

              {/* Discount badge */}
              {discount && discount > 0 && (
                <div className="absolute top-3 left-3 bg-[#cc0c39] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow z-10">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Image counter */}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg sm:hidden">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>

      {/* ===== FULLSCREEN LIGHTBOX ===== */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image gallery fullscreen view"
        >
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium z-50">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Main fullscreen image */}
          <div
            className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4 sm:mx-8"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[selectedImage]}
              alt={`${title} - Image ${selectedImage + 1}`}
              fill
              className="object-contain"
              quality={90}
            />
          </div>

          {/* Thumbnail strip at bottom */}
          {images.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md rounded-xl p-2 max-w-[90vw] overflow-x-auto hide-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === selectedImage
                      ? "border-white opacity-100 scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain bg-white/10 p-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
