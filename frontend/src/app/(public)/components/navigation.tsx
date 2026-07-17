"use client"

import { cn } from "@/app/lib/utils"
import { Menu, X, User, LogOut, ShoppingCart, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import Image from "next/image"
import { useAuthStore } from "@/store/auth.store"
import { useCart } from "@/app/context/CartContext"
import logo from "../../../../public/assets/logo.svg"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { user, token, hydrated, logout } = useAuthStore()
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

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
    url: "https://www.metro-cool.com",
  }

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300",
          scrolled ? "border-gray-200 shadow-sm" : "border-transparent"
        )}
        role="navigation"
        aria-label="Main Website Navigation"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 lg:h-20 items-center">

            {/* ===== LOGO ===== */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src={logo}
                alt="MetroCool logo"
                className="h-9 sm:h-10 w-auto"
                priority
              />
              <span className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-gray-900">
                  MetroCool
                </span>
                <span className="text-[9px] sm:text-[10px] font-medium text-gray-400 hidden sm:block">
                  Managed by Comfort HVAC Solutions
                </span>
              </span>
            </Link>

            {/* ===== DESKTOP NAV LINKS ===== */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* ===== RIGHT SIDE ===== */}
            <div className="flex items-center gap-2">

              {/* Cart Icon — hidden on mobile (available in mobile menu) */}
              {isLoggedIn && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors hidden sm:flex"
                  aria-label="View cart"
                >
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  {/* Book Service — hidden on mobile & tablet */}
                  <Link href="/services" className="hidden md:block">
                    <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
                      Book Service
                    </button>
                  </Link>

                  {/* Profile — hidden on mobile (available in mobile menu) */}
                  <div className="relative hidden sm:block" ref={dropdownRef}>
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex cursor-pointer items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors"
                      aria-label="Profile menu"
                    >
                      <div className="text-right hidden lg:block">
                        <div className="text-sm font-semibold text-gray-900 leading-tight">
                          {user?.firstName || "User"}
                        </div>
                        <div className="text-[11px] text-gray-500 capitalize">
                          {user?.role || "Member"}
                        </div>
                      </div>
                      <div className="relative">
                        <Image
                          src={user?.profile_photo || "/assets/profile.png"}
                          alt="Profile"
                          width={36}
                          height={36}
                          unoptimized
                          className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1.5 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1.5" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-[calc(100%-12px)] rounded-lg mx-1.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/auth/">
                  <button className="bg-blue-600 cursor-pointer text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
                    Register
                  </button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 transition-opacity duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl transform transition-all duration-300 ease-out max-h-[calc(100vh-4rem)] overflow-y-auto",
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          )}
        >
          <div className="px-4 py-4 space-y-1">
            {/* Nav Links */}
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  {item.label}
                  <ChevronRight className={cn(
                    "w-4 h-4",
                    isActive ? "text-blue-400" : "text-gray-300"
                  )} />
                </Link>
              )
            })}

            <div className="border-t border-gray-100 my-3" />

            {/* Book Service */}
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
                Book a Service
              </button>
            </Link>

            {/* Cart (mobile) */}
            {isLoggedIn && cartCount > 0 && (
              <Link
                href="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-gray-50 text-gray-700 mt-2"
              >
                <span className="text-sm font-medium flex items-center gap-2.5">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  View Cart
                </span>
                <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
                  {cartCount}
                </span>
              </Link>
            )}

            {/* Profile & Logout (mobile) */}
            {isLoggedIn && (
              <div className="mt-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <div className="relative">
                    <Image
                      src={user?.profile_photo || "/assets/profile.png"}
                      alt="Profile"
                      width={32}
                      height={32}
                      unoptimized
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user?.firstName || "User"} {user?.lastName || ""}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role || "Member"}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
