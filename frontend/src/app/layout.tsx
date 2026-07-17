import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import { ToastContainer } from 'react-toastify';
import Providers from "./providers"
import SessionGuard from "./components/SessionGuard"
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Script from "next/script";



const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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

  icons: {
    icon: [
      { url: "/assets/logo.ico" },
      { url: "/assets/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/assets/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/assets/apple-icon.png",
  },

  openGraph: {
    title: "Metro Cool AC Service Ahmedabad",
    description:
      "Professional Air Conditioner repair and installation service in Ahmedabad.",
    url: "https://www.metro-cool.com",
    siteName: "Metro Cool",
    locale: "en_IN",
    type: "website",
    images: [
    {
      url: "https://www.metro-cool.com/og.jpg",
      width: 1200,
      height: 630,
    },
  ],
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

{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */ }



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
        className={`${dmSans.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* Razorpay (Correct way) */}


        {/* Local Business Schema for Google */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <Providers>
          <AuthProvider>
            <SessionGuard />
            <main className="flex-1">{children}</main>
          </AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
            limit={3}
            toastClassName="!rounded-xl !shadow-2xl !font-sans !text-sm !font-medium"
          />
        </Providers>
      </body>
    </html>
  );
}
