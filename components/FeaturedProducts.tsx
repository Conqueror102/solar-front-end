"use client"

import { useProducts } from "@/hooks/useProducts"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FeaturedProducts() {
  const { data: products, isLoading } = useProducts({ featured: true, limit: 8 })

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 loading-skeleton"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto loading-skeleton"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 loading-skeleton"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highest-rated solar energy solutions
          </p>
        </div>

        {/* Horizontal scrolling carousel */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {products?.map((product) => (
              <div key={product.id} className="flex-none w-72 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl">
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
