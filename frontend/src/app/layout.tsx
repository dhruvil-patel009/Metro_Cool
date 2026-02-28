import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "sonner";
import AuthProvider from "@/providers/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import Providers from "./providers"
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Script from "next/script";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ================= SEO METADATA ================= */


export const metadata: Metadata = {
  metadataBase: new URL("https://www.metro-cool.com"),

  title: {
    default: "Metro Cool - AC Repair & AC Service in Ahmedabad",
    template: "%s | Metro Cool Ahmedabad",
  },

  description:
    "Metro Cool provides professional AC repair, installation, gas filling and maintenance services in Ahmedabad. Same-day doorstep service at affordable price.",

  keywords: [
    "AC repair Ahmedabad",
    "AC service Ahmedabad",
    "AC installation Ahmedabad",
    "AC gas filling Ahmedabad",
    "AC technician near me",
    "Split AC repair Ahmedabad",
    "Window AC repair Ahmedabad",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Metro Cool AC Service Ahmedabad",
    description:
      "Professional Air Conditioner repair and installation service in Ahmedabad.",
    url: "https://www.metro-cool.com",
    siteName: "Metro Cool",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Metro Cool",
    url: "https://www.metro-cool.com",
    telephone: "+91XXXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    areaServed: "Ahmedabad",
    priceRange: "₹₹",
  };
 return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Razorpay (Correct way) */}
        {/* <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        /> */}

        {/* Local Business Schema for Google */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <Providers>
          <AuthProvider>
            <main className="flex-1">{children}</main>
          </AuthProvider>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
