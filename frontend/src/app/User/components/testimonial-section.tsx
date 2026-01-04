"use client"

import { useState } from "react"
import { TestimonialCard } from "./ui/testimonial-card"
import { testimonials } from "../lib/data"

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((item, index) => (
              <div key={index} className="min-w-full md:min-w-[50%] px-2">
                <TestimonialCard {...item} />
              </div>
            ))}
          </div>
        </div>

        {/* Dotted Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i * 2)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === i * 2 ? "bg-blue-600 scale-125" : "bg-gray-400/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
