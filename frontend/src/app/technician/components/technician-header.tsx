import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"

export function TechnicianHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-8 px-6">
        {/* Logo and Brand */}
        <Link href="/technician" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">TechService Pro</span>
        </Link>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search jobs, customers..."
            className="h-10 w-full rounded-lg border-gray-200 bg-gray-50 pl-10 text-sm focus-visible:ring-blue-600"
          />
        </div>

        {/* Navigation and Actions */}
        <nav className="ml-auto flex items-center gap-8">
          <Link href="/technician" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Dashboard
          </Link>
          <Link href="/technician/schedule" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Schedule
          </Link>
          <Link href="/technician/earnings" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Earnings
          </Link>
          <Link href="/technician/support" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Support
          </Link>

          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
            <AvatarFallback className="bg-blue-600 text-white text-sm">AL</AvatarFallback>
          </Avatar>
        </nav>
      </div>
    </header>
  )
}
