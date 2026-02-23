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
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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

          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 sm:py-8 sm:px-8 py-8 px-2 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
