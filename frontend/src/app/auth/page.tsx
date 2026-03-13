"use client"

import Link from "next/link"
import { LogIn, User, Wrench, UserPlus, Briefcase } from "lucide-react"

export default function JoinMetroCool() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            Join <span className="text-blue-600">Metro Cool</span>
          </h1>

          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Experience next-generation cooling services or join our network of
            certified cooling professionals.
          </p>
        </div>

        {/* LOGIN SECTION */}
        <div>
          <p className="text-xs tracking-widest text-gray-400 text-center mb-6">
            LOGIN
          </p>

          <div className="max-w-md mx-auto">

            {/* USER LOGIN */}
            <Link href="/auth/login">
              <div className="bg-white p-6 rounded-xl border hover:shadow-md transition cursor-pointer">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <User className="text-blue-600 w-6 h-6" />
                </div>

                <h3 className="font-semibold text-lg">Login as User</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Sign in to manage your bookings and service requests.
                </p>
              </div>
            </Link>

            {/* TECHNICIAN LOGIN */}
          </div>
        </div>

        {/* REGISTER SECTION */}
        <div className="mt-14">
          <p className="text-xs tracking-widest text-gray-400 text-center mb-2">
            NEW HERE?
          </p>

          <h2 className="text-center text-2xl font-semibold mb-6">
            Register Now
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* REGISTER USER */}
            <Link href="/auth/register">
              <div className="bg-white p-6 rounded-xl border hover:shadow-md transition cursor-pointer">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="text-blue-600 w-6 h-6" />
                </div>

                <h3 className="font-semibold text-lg">Register as User</h3>

                <p className="text-sm text-gray-500 mt-1">
                  Create an account to book AC services quickly.
                </p>
              </div>
            </Link>

            {/* REGISTER TECHNICIAN */}
            <Link href="/auth/technician-registration">
              <div className="bg-white p-6 rounded-xl border hover:shadow-md transition cursor-pointer">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="text-blue-600 w-6 h-6" />
                </div>

                <h3 className="font-semibold text-lg">
                  Register as Technician
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Join Metro Cool and start receiving service requests.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
