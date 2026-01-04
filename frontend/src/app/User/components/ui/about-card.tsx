import type React from "react"
interface AboutCardProps {
  icon: React.ReactNode
  title: string
  desc: string
}

export function AboutCard({ icon, title, desc }: AboutCardProps) {
  return (
    <div className="bg-[#f9fafb] p-8 rounded-md flex items-center gap-6 border border-gray-50 shadow-sm hover:shadow-md transition-all group">
      <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-[#1d242d] mb-1">{title}</h3>
        <p className="text-sm text-gray-400 font-medium">{desc}</p>
      </div>
    </div>
  )
}
