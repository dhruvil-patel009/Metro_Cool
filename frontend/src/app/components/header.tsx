"use client"

import { cn } from "@/app/lib/utils"
import { Snowflake, Menu, FileText, User, MapPin, CreditCard, Bell, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import logo from '../../../public/assets/logo.ico'

export default function Header() {
    const router = useRouter();

    const pathname = usePathname()
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)

const handlelogin = () => {
    router.push('/auth/login');
}
    const navItems = [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services" },
        { href: "/products", label: "Products" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="#">
                        <Image src={logo} alt="Metro cool logo" width={120} />
                        </Link>
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
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md hover:scale-105 duration-200 cursor-pointer" onClick={handlelogin}>
                            Login
                        </button>

                        {/* <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">Alex Johnson</div>
                  <div className="text-xs text-gray-500">Gold Member</div>
                </div>
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=40&width=40"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile 
                  </Link>
                 
                  <div className="border-t border-gray-100 my-2"></div>
                  <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div> */}

                        <button className="md:hidden">
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
