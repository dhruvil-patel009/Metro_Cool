import { WeeklyEarningsChart } from "./components/weekly-earnings-chart";
import { WeeklyBookingsChart } from "./components/weekly-Booking-chart";
import { RecentBookingsTable } from "./components/recent-booking";
import { StatCard } from "./components/state-card";
import { Smartphone, DollarSign, Users, Calendar } from "lucide-react"



export default function AdminDashboard() {

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
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
       {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <WeeklyBookingsChart />
        <WeeklyEarningsChart />
      </div>

      {/* Recent Bookings */}
      <RecentBookingsTable />
    </div>
  );
}
