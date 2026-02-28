"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getTechnicians, TechnicianDTO } from "@/app/lib/technician.api"

export default function TeamSection() {
  const [technicians, setTechnicians] = useState<TechnicianDTO[]>([])
  const [loading, setLoading] = useState(true)

  // ⭐ controls how many technicians are visible
  const [visibleCount, setVisibleCount] = useState(4)

  /* ================= FETCH TECHNICIANS ================= */
  useEffect(() => {
    getTechnicians()
      .then(setTechnicians)
      .finally(() => setLoading(false))
  }, [])

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <section id="team" className="py-20 bg-gray-50">
        <div className="text-center text-gray-500 text-lg">
          Loading technicians...
        </div>
      </section>
    )
  }

  /* ================= UI ================= */
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Meet the Experts
            </h2>
            <p className="text-gray-600">
              The people behind the perfect temperature
            </p>
          </div>

          <Link
            href="/contact"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Join our team →
          </Link>
        </div>

        {/* TECHNICIAN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {technicians.slice(0, visibleCount).map((tech) => (
            <div key={tech.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">

                {/* PHOTO */}
                <div className="aspect-[3/4] relative bg-gray-200">
                  <Image
                    src={tech.photo_url || "/placeholder-user.png"}
                    alt={tech.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* INFO */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {tech.name}
                  </h3>

                  <p className="text-blue-600 font-semibold mb-3">
                    {tech.role}
                  </p>

                  {/* SERVICES BADGES */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tech.services?.slice(0, 3).map((service: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                      <span
                        key={i}
                        className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* SHOW MORE / LESS BUTTON */}
        <div className="text-center mt-12">
          {visibleCount < technicians.length ? (
            <button
              onClick={() => setVisibleCount(technicians.length)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition"
            >
              View All Technicians
            </button>
          ) : technicians.length > 4 ? (
            <button
              onClick={() => setVisibleCount(4)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition"
            >
              Show Less
            </button>
          ) : null}
        </div>

      </div>
    </section>
  )
}