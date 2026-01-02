import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-4 px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, technicians, services..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">Alex Morgan</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-cyan-500">
              <AvatarFallback className="bg-cyan-100 text-cyan-700">AM</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
