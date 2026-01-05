import { Search, Bell, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">Overview</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10 bg-slate-50 border-none h-10 ring-offset-0 focus-visible:ring-1 focus-visible:ring-slate-200"
            placeholder="Search jobs, customers..."
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right">
            <p className="text-sm font-bold leading-none">Alex Johnson</p>
            <p className="text-[11px] text-muted-foreground mt-1">Senior Technician</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-slate-100">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
