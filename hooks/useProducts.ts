"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  images: string[]
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
  wattage?: number
  features?: string[]
  specifications?: Record<string, string>
  dimensions?: {
    length: string
    width: string
    height: string
  }
  weight?: string
}

// Mock data - replace with actual API calls
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
  {
    id: "2",
    name: "PowerTech 3000W Pure Sine Wave Inverter",
    slug: "powertech-3000w-inverter",
    description: "Professional-grade pure sine wave inverter for clean, stable power conversion.",
    price: 599,
    image: "/placeholder.svg?height=400&width=400",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    category: "inverters",
    brand: "PowerTech",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    featured: true,
    wattage: 3000,
    features: [
      "Pure sine wave output",
      "LCD display with monitoring",
      "Multiple protection systems",
      "Remote monitoring capability",
    ],
    specifications: {
      "Output Power": "3000W",
      "Peak Power": "6000W",
      "Input Voltage": "12V DC",
      "Output Voltage": "120V AC",
      Efficiency: "90%",
    },
  },
  {
    id: "3",
    name: "EcoSolar 200Ah Lithium Battery",
    slug: "ecosolar-200ah-battery",
    description: "Long-lasting lithium iron phosphate battery for reliable energy storage.",
    price: 899,
    originalPrice: 999,
    discount: 10,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    category: "batteries",
    brand: "EcoSolar",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    featured: true,
    features: ["LiFePO4 technology", "6000+ cycle life", "Built-in BMS protection", "Maintenance-free operation"],
    specifications: {
      Capacity: "200Ah",
      Voltage: "12V",
      Chemistry: "LiFePO4",
      "Cycle Life": "6000+",
      "Operating Temperature": "-20°C to 60°C",
    },
  },
  {
    id: "4",
    name: "GreenEnergy MPPT 60A Charge Controller",
    slug: "greenenergy-mppt-60a",
    description: "Advanced MPPT charge controller with smart tracking technology.",
    price: 199,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    category: "controllers",
    brand: "GreenEnergy",
    rating: 4.7,
    reviews: 78,
    inStock: true,
    featured: false,
    features: ["MPPT technology", "LCD display", "Multiple load control modes", "Temperature compensation"],
    specifications: {
      "Max Current": "60A",
      "System Voltage": "12V/24V Auto",
      "Max PV Voltage": "150V",
      Efficiency: "98%",
      Display: "LCD",
    },
  },
]

// Generate more mock products
for (let i = 5; i <= 50; i++) {
  const categories = ["solar-panels", "inverters", "batteries", "controllers"]
  const brands = ["SolarMax", "PowerTech", "EcoSolar", "GreenEnergy", "SunPower", "Tesla"]
  const category = categories[Math.floor(Math.random() * categories.length)]
  const brand = brands[Math.floor(Math.random() * brands.length)]

  mockProducts.push({
    id: i.toString(),
    name: `${brand} ${category.replace("-", " ")} Model ${i}`,
    slug: `${brand.toLowerCase()}-${category}-${i}`,
    description: `High-quality ${category.replace("-", " ")} with advanced features and reliable performance.`,
    price: Math.floor(Math.random() * 1000) + 100,
    originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 1200) + 200 : undefined,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 5 : undefined,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    category,
    brand,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    reviews: Math.floor(Math.random() * 200) + 10,
    inStock: Math.random() > 0.1,
    featured: Math.random() > 0.8,
    wattage:
      category === "solar-panels" || category === "inverters" ? Math.floor(Math.random() * 1000) + 100 : undefined,
    features: ["High efficiency design", "Durable construction", "Easy installation", "Long warranty period"],
    specifications: {
      Model: `${brand}-${i}`,
      Efficiency: `${Math.floor(Math.random() * 10) + 85}%`,
      Warranty: "25 years",
    },
  })
}

interface UseProductsOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  wattage?: string
  inStock?: boolean
  featured?: boolean
  limit?: number
}

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let filtered = [...mockProducts]

      // Apply filters
      if (options.category) {
        filtered = filtered.filter((p) => p.category === options.category)
      }

      if (options.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= options.minPrice!)
      }

      if (options.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= options.maxPrice!)
      }

      if (options.brand) {
        filtered = filtered.filter((p) => p.brand === options.brand)
      }

      if (options.inStock) {
        filtered = filtered.filter((p) => p.inStock)
      }

      if (options.featured) {
        filtered = filtered.filter((p) => p.featured)
      }

      if (options.wattage) {
        const [min, max] = options.wattage.split("-").map(Number)
        if (max) {
          filtered = filtered.filter((p) => p.wattage && p.wattage >= min && p.wattage <= max)
        } else if (options.wattage.includes("+")) {
          filtered = filtered.filter((p) => p.wattage && p.wattage >= min)
        }
      }

      // Pagination
      const limit = options.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filtered.slice(0, endIndex)

      setData(paginatedData)
      setHasMore(endIndex < filtered.length)
      setIsLoading(false)
    }

    fetchProducts()
  }, [
    options.category,
    options.minPrice,
    options.maxPrice,
    options.brand,
    options.inStock,
    options.featured,
    options.wattage,
    options.limit,
    page,
  ])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  return {
    data,
    isLoading,
    hasMore,
    loadMore,
  }
}
