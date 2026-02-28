"use client"

import { cn } from "@/app/lib/utils"
import { Menu, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import Image from "next/image"
import { useAuthStore } from "@/store/auth.store"
import logo from "../../../../public/assets/logo.ico"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ⭐ Zustand Auth
  const { user, token, hydrated, logout } = useAuthStore()

  // ⭐ wait for zustand persistence
  if (!hydrated) return null

  const isLoggedIn = !!token

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
    router.replace("/")
    toast.success("Logged out successfully")
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: "https://www.metrocool.com",
  }

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b border-gray-100"
      role="navigation"
      aria-label="Main Website Navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      {/* SEO schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
      />

      {/* MOBILE MENU */}
      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 top-20 z-40 bg-white border-t border-gray-100 shadow-lg transform transition-all duration-300 ease-in-out",
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col px-4 py-5 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-sm font-medium px-3 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {item.label}
              </Link>
            )
          })}

          <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700">
              Book Service
            </button>
          </Link>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src={logo} alt="Metro cool logo" width={120} />
            </Link>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-600">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 transition-colors duration-200",
                    isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              )
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">



            {/* ================= AUTH SECTION ================= */}

            {isLoggedIn ? (

              <><Link href="/services">
                <button className="bg-blue-600 text-white sm:px-6 px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105 duration-200">
                  Book Service
                </button>
              </Link>

                <div className="relative">

                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex cursor-pointer items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-gray-900">
                        {user?.firstName || "User"} {user?.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.role || "Member"}
                      </div>
                    </div>

                    <div className="relative">
                      <Image
                        src={user?.profile_photo || "/assets/profile.png"}
                        alt="Profile"
                        width={40}
                        height={40}
                        unoptimized
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </button>



                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        href="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div></>
            ) : (
              /* LOGIN BUTTON (GUEST) */
              <Link href="/auth/login">
                <button className="bg-blue-600 text-white sm:px-6 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-sm hover:shadow-md hover:scale-105 duration-200">
                  Login
                </button>
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}