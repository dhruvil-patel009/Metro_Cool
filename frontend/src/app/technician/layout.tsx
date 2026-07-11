import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SidebarProvider } from "./components/sidebar-content"
import { AppLayout } from "./components/app-layout"
import ProtectedRoute from "../components/ProtectedRoute"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Technician Dashboard | Metro Cool",
  description: "Metro Cool Technician Dashboard - Manage your service jobs",
  icons: {
    icon: [
      {
        url: "/assets/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/assets/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: "/assets/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
     <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen">
          <Sidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:px-8 overflow-auto bg-slate-50/40">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
