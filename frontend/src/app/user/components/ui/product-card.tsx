import { ShoppingBag, Star } from "lucide-react"

interface ProductCardProps {
  image: string
  title: string
  subtitle: string
  price: string
  badge?: string
  oldPrice?: string
  discount?: string
}

export function ProductCard({ image, title, subtitle, price, badge, oldPrice, discount }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-50 mb-4">
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            {badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-4 left-4 z-10 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            {discount}
          </span>
        )}
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-4 h-4 text-gray-400" />
        </button> */}
      </div>
      <div className="px-4 py-3">
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-4 font-medium">{subtitle}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">${price}</span>
            {oldPrice && <span className="text-xs text-gray-300 line-through">${oldPrice}</span>}
          </div>
          <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
