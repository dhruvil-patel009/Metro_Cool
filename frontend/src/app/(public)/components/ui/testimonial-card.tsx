import { Star, Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image: string
}

export function TestimonialCard({ quote, author, role, image }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-blue-100 fill-blue-100" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>

      {/* Quote Text */}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-50 shrink-0">
          <img
            src={image || "/placeholder.svg"}
            alt={author}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}
