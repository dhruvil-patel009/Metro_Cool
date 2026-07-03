"use client"

import Link from "next/link"
import { User, UserPlus, Briefcase, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import logo from "../../../public/assets/logo.svg"

export default function JoinMetroCool() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation - same style as home */}
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src={logo} alt="MetroCool logo" className="h-12 w-auto" priority />
                <span className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold tracking-tight text-[#1d242d]">
                    MetroCool
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                    Managed by Comfort HVAC Solutions
                  </span>
                </span>
              </Link>
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-full px-4 py-2 transition-all duration-300 hover:bg-gray-50"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="w-full max-w-6xl">
            {/* Hero Header */}
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Trusted by 10,000+ customers across the city
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-[#1d242d]">
                Get Started with{" "}
                <span className="text-blue-600">MetroCool</span>
              </h1>

              <p className="mt-4 sm:mt-5 text-gray-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Book premium AC services instantly or join as a certified technician
                and grow your business with us.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
              {/* Sign In Card - left side */}
              <Link
                href="/auth/login"
                className="group lg:col-span-5"
                onMouseEnter={() => setHoveredCard("login")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="h-full relative rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-9 overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-1">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl" />

                  <div className="relative z-10 flex flex-col h-full min-h-[300px] sm:min-h-[340px]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/60 mb-6 group-hover:scale-105 transition-transform duration-300">
                      <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>

                    <span className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-2">
                      Already a member?
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#1d242d] mb-3">
                      Sign In
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed flex-1">
                      Access your dashboard, manage bookings, and track all your
                      service requests with secure MPIN authentication.
                    </p>

                    <div className="flex items-center gap-2 mt-6 sm:mt-8">
                      <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                        Continue to Login
                      </span>
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 group-hover:translate-x-1 transition-all duration-300">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Right column - stacked registration cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
                {/* Register as User Card */}
                <Link
                  href="/auth/register"
                  className="group"
                  onMouseEnter={() => setHoveredCard("user")}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="h-full relative rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/60 hover:-translate-y-1">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-2xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/60 group-hover:scale-105 transition-transform duration-300">
                        <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1d242d]">
                            Register as User
                          </h3>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Free
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          Create your account in seconds and start booking AC services right away.
                        </p>
                      </div>

                      <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 group-hover:translate-x-1 transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Register as Technician Card */}
                <Link
                  href="/auth/technician-registration"
                  className="group"
                  onMouseEnter={() => setHoveredCard("tech")}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="h-full relative rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-1">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 rounded-t-2xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200/60 group-hover:scale-105 transition-transform duration-300">
                        <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1d242d]">
                            Join as Technician
                          </h3>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-full">
                            Earn
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          Grow your career with MetroCool. Receive jobs, manage schedules, and get paid.
                        </p>
                      </div>

                      <div className="shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 group-hover:translate-x-1 transition-all duration-300">
                        <ArrowRight className="w-4 h-4 text-violet-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Features Strip */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1d242d]">Secure Login</p>
                  <p className="text-[11px] text-gray-400">4-digit MPIN protection</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1d242d]">Instant Booking</p>
                  <p className="text-[11px] text-gray-400">Book in under 60 seconds</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center sm:justify-end">
                <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1d242d]">Verified Pros</p>
                  <p className="text-[11px] text-gray-400">Certified technicians only</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              © 2026 MetroCool. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
