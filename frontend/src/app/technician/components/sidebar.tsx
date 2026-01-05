"use client"

import Link from "next/link"
import { LayoutDashboard, Calendar, History, DollarSign, Settings, LifeBuoy, CheckCircle2, Briefcase } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "./sidebar-content"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/technician", active: true },
  { label: "Schedule", icon: Calendar, href: "/technician" },
  { label: "Jobs", icon: Briefcase, href: "/technician/jobs" },
  { label: "Earnings", icon: DollarSign, href: "#" },
]

const systemItems = [
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Support", icon: LifeBuoy, href: "#" },
]

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar()

  return (
    <div
      className={cn(
        "border-r bg-white h-screen flex flex-col sticky top-0 transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className={cn("p-6 flex items-center justify-between", isCollapsed ? "px-4" : "px-6")}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="min-w-8 w-8 h-8 bg-black rounded flex items-center justify-center shrink-0">
            <CheckCircle2 className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && <span className="font-bold text-xl tracking-tight whitespace-nowrap">TechPortal</span>}
        </div>
        {!isCollapsed && (
          <Button variant="ghost" size="icon" onClick={toggle} className="md:flex hidden">
            <Menu className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center mb-4">
          <Button variant="ghost" size="icon" onClick={toggle}>
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 px-4 space-y-8 mt-4 overflow-x-hidden">
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Overview</p>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active ? "bg-[#0891b2] text-white" : "text-muted-foreground hover:bg-slate-100",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">System</p>
          )}
          <nav className="space-y-1">
            {systemItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-slate-100 transition-colors",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <item.icon className="w-4 h-4" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 mt-auto border-t">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Weekly Goal</span>
              <span className="text-xs font-bold text-[#0891b2]">85%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0891b2] rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
