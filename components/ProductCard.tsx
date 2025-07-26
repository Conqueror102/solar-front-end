"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/hooks/useProducts"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAddingToCart(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="card-hover bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && <Badge className="bg-accent text-black font-medium">Featured</Badge>}
            {product.discount && <Badge variant="destructive">-{product.discount}%</Badge>}
          </div>

          {/* Wishlist button */}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>

          {/* Quick add to cart */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.wattage && (
              <div className="flex items-center text-xs text-gray-500">
                <Zap className="w-3 h-3 mr-1" />
                {product.wattage}W
              </div>
            )}
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.inStock ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
