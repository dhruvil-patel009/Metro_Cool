"use client"

import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react"
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
          "https://twitter.com/metrocool",
        ],
      },
      {
        "@type": "LocalBusiness",
        name: "Metro Cool Services",
        url: "https://www.metro-cool.com",
        description:
          "Trusted AC repair, AC installation, gas refill and annual maintenance services.",
        areaServed: { "@type": "City", name: "Ahmedabad" },
        address: {
          "@type": "PostalAddress",
          streetAddress:
            "A-401, Suvas Oram, Opp. Hotel Safari, Odhav Ring Road, Odhav",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          postalCode: "382415",
          addressCountry: "IN",
        },
        taxID: "24AALFC4976A1ZK",
      },
    ],
  }

  return (
    <footer className="bg-gray-900 pt-16 sm:pt-20 pb-8 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src={logo} alt="MetroCool logo" className="h-10 w-auto" />
                <span className="flex flex-col leading-tight">
                  <span className="text-lg font-extrabold tracking-tight text-white">
                    MetroCool
                  </span>
                  <span className="text-[10px] font-medium text-gray-500">
                    Managed by Comfort HVAC Solutions
                  </span>
                </span>
              </Link>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner for all cooling solutions. Expert AC services at your doorstep.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>A-401, Suvas Oram, Opp. Hotel Safari, Odhav Ring Road, Ahmedabad 382415</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 91063 85649</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>metrocool.official@gmail.com</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-4 h-4" />, href: "#", external: false },
                { icon: <Twitter className="w-4 h-4" />, href: "#", external: false },
                { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/metrocool.official?igsh=YjE0bmEzY3IwaG56", external: true },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              {["AC Repair", "Installation", "Annual Maintenance", "Gas Refill", "Deep Cleaning"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/services"
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-5">
              Subscribe for exclusive offers, tips, and updates.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              />
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider & Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2026 MetroCool, powered by Comfort HVAC Solutions. All rights reserved.
          </p>
          {/* <p className="text-xs text-gray-600">
            GSTIN: 24AALFC4976A1ZK
          </p> */}
        </div>
      </div>
    </footer>
  )
}
