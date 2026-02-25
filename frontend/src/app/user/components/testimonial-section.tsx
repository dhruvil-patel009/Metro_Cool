"use client"

import { useState } from "react"
import { TestimonialCard } from "./ui/testimonial-card"
import { testimonials } from "../lib/data"

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  // const testimonialSchema = {
  //   "@context": "https://schema.org",
  //   "@graph": [
  //     {
  //       "@type": "Organization",
  //       name: "MetroCool",
  //       url: "https://www.metrocool.com",
  //     },
  //     {
  //       "@type": "AggregateRating",
  //       itemReviewed: {
  //         "@type": "LocalBusiness",
  //         name: "MetroCool",
  //       },
  //       ratingValue:
  //         testimonials.length > 0
  //           ? (
  //               testimonials.reduce(
  //                 (acc, item) => acc + (item.rating || 5),
  //                 0
  //               ) / testimonials.length
  //             ).toFixed(1)
  //           : "5",
  //       reviewCount: testimonials.length,
  //     },
  //     ...testimonials.map((item) => ({
  //       "@type": "Review",
  //       itemReviewed: {
  //         "@type": "LocalBusiness",
  //         name: "MetroCool",
  //       },
  //       author: {
  //         "@type": "Person",
  //         name: item.name,
  //       },
  //       reviewRating: {
  //         "@type": "Rating",
  //         ratingValue: item.rating || 5,
  //         bestRating: 5,
  //       },
  //       reviewBody: item.message,
  //     })),
  //   ],
  // }

  return (
    <section className="py-8">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialSchema),
        }}
      /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">What Our Customers Say</h2>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((item, index) => (
  <div
    key={index}
    className="w-full md:w-1/2 shrink-0 px-2"
  >
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
      onClick={() => setCurrent(i)}
      className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
        current === i ? "bg-blue-600 scale-125" : "bg-gray-400/60"
      }`}
    />
  ))}
</div>

      </div>
    </section>
  )
}
