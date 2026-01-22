"use client"


import { StatCard } from "./components/state-card";
import { WeeklyEarningsChart } from "./components/weekly-earnings-chart";
import { WeeklyBookingsChart } from "./components/weekly-Booking-chart";
import { RecentBookingsTable } from "./components/recent-booking";
import { Smartphone, DollarSign, Users, Calendar } from "lucide-react"



export default function adminDashboard() {

     const stats = [
    {
      icon: Smartphone,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      title: "Total Bookings",
      value: "1,240",
      change: "+12%",
      isPositive: true,
    },
    {
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      title: "Total Revenue",
      value: "$84,300",
      change: "+8.5%",
      isPositive: true,
    },
    {
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      title: "Active Technicians",
      value: "42",
      change: "0%",
      isPositive: false,
    },
    {
      icon: Calendar,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      title: "Today's Jobs",
      value: "18",
      change: "+2",
      isPositive: true,
    },
  ]

  return (
   <div className="flex min-h-screen bg-gray-50/50">

      <div className="flex flex-1 flex-col">

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  animation: "fadeInUp 0.5s ease-out",
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <StatCard {...stat} />
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <WeeklyBookingsChart />
            <WeeklyEarningsChart />
          </div>

          {/* Recent Bookings Table */}
          <RecentBookingsTable />
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
