import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image: string
}

export function TestimonialCard({ quote, author, role, image }: TestimonialCardProps) {
  return (
    <div className="bg-white p-10 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex gap-1 mb-6 text-blue-600">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <p className="text-lg text-gray-600 italic leading-relaxed mb-8">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
          <img src={image || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{author}</p>
          <p className="text-xs text-gray-400 font-medium">{role}</p>
        </div>
      </div>
    </div>
  )
}
