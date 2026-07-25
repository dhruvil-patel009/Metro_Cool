"use client"

import { useState, useEffect, useCallback } from "react"
import { testimonials } from "../lib/data"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(2)
  const totalSlides = Math.ceil(testimonials.length / itemsPerPage)

  useEffect(() => {
    const update = () => setItemsPerPage(window.innerWidth < 768 ? 1 : 2)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides)
    }, 6000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const goNext = useCallback(() => setCurrent((prev) => (prev + 1) % totalSlides), [totalSlides])
  const goPrev = useCallback(() => setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides), [totalSlides])

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
            Trusted by hundreds of homeowners and businesses across the city
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <button
            onClick={goPrev}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all cursor-pointer"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={goNext}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-105 transition-all cursor-pointer"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="overflow-hidden px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 transition-opacity duration-300">
              {testimonials
                .slice(current * itemsPerPage, current * itemsPerPage + itemsPerPage)
                .map((item, index) => (
                  <div
                    key={`${current}-${index}`}
                    className="bg-white p-7 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                  >
                    <Quote className="w-8 h-8 text-blue-100 fill-blue-100 mb-4" />
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 flex-1">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-50 shrink-0">
                        <img src={item.image || "/placeholder.svg"} alt={item.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.author}</p>
                        <p className="text-xs text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                current === i ? "w-8 h-2.5 bg-blue-600" : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
