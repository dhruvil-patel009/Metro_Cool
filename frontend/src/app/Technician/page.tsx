import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Bell,
  MapPin,
  Calendar,
  Clock,
  MoreVertical,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"

export default function TechnicianDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-600">Welcome back, Alex</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Earnings */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">$2,450</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+12% last week</span>
                </div>
              </div>
              <div className="rounded-full bg-blue-50 p-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Jobs */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
                <p className="text-3xl font-bold text-gray-900">42</p>
                <p className="text-sm text-green-600">+4 this week</p>
              </div>
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Jobs */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Pending Jobs</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Action Required</p>
              </div>
              <div className="rounded-full bg-orange-50 p-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Requests */}
        <Card className="border-gray-200 bg-blue-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">New Requests</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <Badge className="mt-1 bg-blue-600 text-white hover:bg-blue-700">High Priority</Badge>
              </div>
              <div className="rounded-full bg-blue-600 p-3">
                <Bell className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs Section */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200">
          <button className="relative pb-3 text-sm font-semibold text-blue-600">
            New Jobs
            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">3</span>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          </button>
          <button className="pb-3 text-sm font-medium text-gray-600 hover:text-gray-900">
            Accepted Jobs
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">5</span>
          </button>
          <button className="pb-3 text-sm font-medium text-gray-600 hover:text-gray-900">Completed Jobs</button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Card 1 */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100">New Request</Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>15 min ago</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-gray-900">AC Repair & Maintenance</h3>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="text-xs">SJ</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">Sarah Jenkins</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Downtown Lofts, Apt 4B</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Today, 2:00 PM - 4:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">View Details</Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="w-48 bg-gray-100">
                  <img src="/floor-plan-blueprint.png" alt="Job" className="h-full w-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Card 2 */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100">New Request</Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>45 min ago</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Commercial Plumbing Check</h3>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="bg-blue-600 text-xs text-white">TF</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">TechFlow Inc.</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>1200 Innovation Drive, Floor 3</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Tomorrow, 9:00 AM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">View Details</Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="w-48 bg-gray-100">
                  <img src="/plumbing-pipes-commercial-building.jpg" alt="Job" className="h-full w-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Card 3 */}
          <Card className="overflow-hidden border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100">Pending Approval</Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>2 hrs ago</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Smart Thermostat Install</h3>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback className="bg-gray-700 text-xs text-white">MR</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">Mike Ross</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>850 West Gardens</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Thu, Oct 12, 10:30 AM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="w-48 bg-gray-100">
                  <img src="/smart-thermostat-black-modern.jpg" alt="Job" className="h-full w-full object-cover" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
