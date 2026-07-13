import { Facebook, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "../../../../public/assets/logo.svg"

export function Footer() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "MetroCool",
        url: "https://www.metro-cool.com",
        logo: "https://www.metro-cool.com/logo.png",
        description:
          "MetroCool provides professional AC repair, installation, maintenance and cooling solutions.",
        parentOrganization: {
          "@type": "Organization",
          name: "Comfort HVAC Solutions",
        },
        sameAs: [
          "https://facebook.com/metrocool",
          "https://twitter.com/metrocool"
        ]
      },
      {
        "@type": "LocalBusiness",
        name: "Metro Cool Services",
        url: "https://www.metro-cool.com",
        description:
          "Trusted AC repair, AC installation, gas refill and annual maintenance services.",
        areaServed: {
          "@type": "City",
          name: "Ahmedabad"
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "A-401, Suvas Oram, Opp. Hotel Safari, Odhav Ring Road, Odhav",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          postalCode: "382415",
          addressCountry: "IN"
        },
        taxID: "24AALFC4976A1ZK"
      }
    ]
  }
  return (
    <footer className="bg-[#f4f4f4] pt-16 pb-12 border-t border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src={logo} alt="MetroCool logo" className="h-12 w-auto" />
                <span className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold tracking-tight text-[#1d242d]">MetroCool</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                    Managed by Comfort HVAC Solutions
                  </span>
                </span>
              </Link>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your trusted partner for all cooling solutions. We bring comfort to your home with expert services.
            </p>
            <div className="text-xs text-gray-500 space-y-1.5 mb-6">
              <p className="font-medium text-gray-700">📍 Shop Address:</p>
              <p>A-401, Suvas Oram, Opp. Hotel Safari,</p>
              <p>Odhav Ring Road, Odhav,</p>
              <p>Ahmedabad, Gujarat 382415, IN</p>
              <p className="pt-1 font-medium text-gray-600">GSTIN: 24AALFC4976A1ZK</p>
            </div>
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
                <Link href="/services" className="hover:text-blue-600">
                  AC Repair
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600">
                  Annual Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-600">
                  Gas Refill
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600">
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
            &copy; 2026 MetroCool, powered by Comfort HVAC Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
