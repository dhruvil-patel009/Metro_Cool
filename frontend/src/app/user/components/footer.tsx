import { Snowflake, Facebook, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#f4f4f4] pt-40 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Snowflake className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Metro Cool</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your trusted partner for all cooling solutions. We bring comfort to your home with expert services.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-sm border border-gray-100 hover:text-blue-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  AC Repair
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Annual Maintenance
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Gas Refill
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 mb-6">Subscribe to get special offers and updates.</p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <button className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-12 border-t border-gray-200">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            &copy; 2026 Metro Cool Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
