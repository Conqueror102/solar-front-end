"use client"

import { useState, useEffect } from "react"
import type { Product } from "./useProducts"

// Import the mock products directly to avoid dependency issues
const mockProducts: Product[] = [
  {
    id: "1",
    name: "SolarMax Pro 400W Solar Panel",
    slug: "solarmax-pro-400w",
    description: "High-efficiency monocrystalline solar panel with advanced cell technology for maximum power output.",
    price: 299,
    originalPrice: 349,
    discount: 15,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    category: "solar-panels",
    brand: "SolarMax",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    wattage: 400,
    features: [
      "High-efficiency monocrystalline cells",
      "25-year power output warranty",
      "Weather-resistant aluminum frame",
      "Easy installation system",
    ],
    specifications: {
      "Cell Type": "Monocrystalline",
      Efficiency: "22.1%",
      Voltage: "24V",
      Current: "16.67A",
      "Temperature Coefficient": "-0.35%/°C",
    },
    dimensions: {
      length: "2008mm",
      width: "1002mm",
      height: "35mm",
    },
    weight: "22.5kg",
  },
  // Add other mock products here or import from a separate file
]

export function useProduct(slug: string) {
  const [data, setData] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      const product = mockProducts.find((p) => p.slug === slug) || null
      setData(product)
      setIsLoading(false)
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  return {
    data,
    isLoading,
  }
}
