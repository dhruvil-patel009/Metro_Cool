import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "./ui/product-card"
import { products } from "../lib/data"

export function ProductsSection() {

  // const productsSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "ItemList",
  //   name: "Featured Air Conditioning Products",
  //   itemListElement: products.map((product, index) => ({
  //     "@type": "Product",
  //     position: index + 1,
  //     name: product.title,
  //     image: product.image,
  //     description: product.description,
  //     brand: {
  //       "@type": "Brand",
  //       name: product.brand || "Metro Cool",
  //     },
  //     offers: {
  //       "@type": "Offer",
  //       priceCurrency: "USD",
  //       price: product.price,
  //       availability: "https://schema.org/InStock",
  //     },
  //   })),
  // }

  return (
    <section className="py-8 bg-white" aria-labelledby="featured-products-heading">
       {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsSchema),
        }}
      /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="m-auto">
            <h2 className="text-2xl md:text-4xl
 font-bold mb-2">Featured Products</h2>
            <p className="text-gray-500 text-center">Genuine parts and top-rated appliances</p>
          </div>
          <Link href="/user/products" className="text-blue-600 font-bold text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
