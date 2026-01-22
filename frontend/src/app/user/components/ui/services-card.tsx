import type React from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  linkText: string
}

export function ServiceCard({ icon, title, description, linkText }: ServiceCardProps) {
  return (
    <div className="bg-white p-10 rounded-lg border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
      <div className="w-16 h-16 bg-blue-50 rounded-md flex items-center justify-center mb-6 transition-colors duration-300">
        <div className="group-hover:text-white">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed mb-8">{description}</p>
      <Link href="#" className="text-blue-600 font-bold text-sm flex items-center gap-1">
        {linkText} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
