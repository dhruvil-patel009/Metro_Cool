"use client"

import { useState } from "react"
import { AppLayout } from "@/app/components/ui/app-layout"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Wallet, TrendingUp, Briefcase, CarIcon as ChartColumn, Download, ChevronDown } from "lucide-react"

const earningsData = {
  thisMonth: {
    total: 4250.0,
    growth: 12,
    jobsCompleted: 24,
    avgPerJob: 177.08,
  },
  thisWeek: {
    total: 980.0,
    growth: 8,
    jobsCompleted: 6,
    avgPerJob: 163.33,
  },
}

const earningsHistory = [
  { id: "#JB-1024", service: "AC Maintenance", category: "Regular Service", date: "Oct 24, 2023", amount: 120.0 },
  { id: "#JB-1023", service: "Emergency Repair", category: "Urgent", date: "Oct 23, 2023", amount: 250.0 },
  { id: "#JB-1022", service: "System Installation", category: "New Unit", date: "Oct 22, 2023", amount: 450.0 },
  { id: "#JB-1021", service: "Service Call", category: "Diagnostics", date: "Oct 21, 2023", amount: 95.0 },
  { id: "#JB-1020", service: "Filter Replacement", category: "Maintenance", date: "Oct 20, 2023", amount: 65.0 },
  { id: "#JB-1019", service: "AC Repair", category: "Regular Service", date: "Oct 19, 2023", amount: 180.0 },
  { id: "#JB-1018", service: "Heating System Check", category: "Regular Service", date: "Oct 18, 2023", amount: 140.0 },
]

export default function EarningsPage() {
  const [period, setPeriod] = useState<"week" | "month">("month")
  const [showMore, setShowMore] = useState(false)

  const currentData = period === "month" ? earningsData.thisMonth : earningsData.thisWeek

  const visibleHistory = showMore ? earningsHistory : earningsHistory.slice(0, 5)

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Earnings</h1>
              <p className="text-slate-600 mt-1">Track your performance and income</p>
            </div>

            {/* Period Toggle */}
            <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm border border-slate-200">
              <Button
                variant={period === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriod("week")}
                className={`transition-all duration-300 ${
                  period === "week"
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                This Week
              </Button>
              <Button
                variant={period === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriod("month")}
                className={`transition-all duration-300 ${
                  period === "month"
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                This Month
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Earnings Card */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-cyan-50 transition-colors duration-300">
                    <Wallet className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Total Earnings</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-slate-900">${currentData.total.toFixed(2)}</p>
                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {currentData.growth}% vs last {period}
                </Badge>
              </div>
            </Card>

            {/* Jobs Completed Card */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-cyan-50 transition-colors duration-300">
                    <Briefcase className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Jobs Completed</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900">{currentData.jobsCompleted}</p>
            </Card>

            {/* Average Per Job Card */}
            <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-cyan-50 transition-colors duration-300">
                    <ChartColumn className="w-5 h-5 text-slate-600 group-hover:text-cyan-600 transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Avg. Per Job</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900">${currentData.avgPerJob.toFixed(2)}</p>
            </Card>
          </div>

          {/* Earnings History */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Earnings History</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-slate-50 transition-colors duration-300 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Job ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleHistory.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 group"
                      style={{
                        animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-900">{item.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{item.service}</span>
                          <span className="text-sm text-slate-500">{item.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-600">{item.date}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-cyan-600 group-hover:text-cyan-700 transition-colors duration-200">
                          ${item.amount.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Show More Button */}
            <div className="flex justify-center mt-6">
              <Button
                variant="ghost"
                onClick={() => setShowMore(!showMore)}
                className="gap-2 hover:bg-slate-50 transition-all duration-300"
              >
                {showMore ? "Show Less History" : "Show More History"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showMore ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AppLayout>
  )
}
