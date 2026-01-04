"use client"

import { cn } from "@/app/lib/utils"
import { Snowflake, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/User", label: "Home" },
    { href: "/User/services", label: "Services" },
    { href: "/User/products", label: "Products" },
    { href: "/User/about", label: "About Us" },
    { href: "/User/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Snowflake className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Metro Cool</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-2 transition-colors duration-200",
                    isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 hover:w-full" />
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105 duration-200">
              Book Now
            </button>
            <button className="hidden sm:block text-gray-600 px-4 py-2 text-sm font-semibold hover:text-gray-900 transition-colors duration-200">
              Login
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
