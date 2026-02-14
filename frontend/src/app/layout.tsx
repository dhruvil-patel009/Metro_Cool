import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { Toaster } from "sonner";
import AuthProvider from "@/providers/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import Providers from "./providers"
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metro Cool",
  description: "AC Service Platform",
};

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
        <AuthProvider>
          <main className="flex-1">{children}</main>
        </AuthProvider>

        {/* <Toaster position="top-right" richColors closeButton /> */}
        <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
