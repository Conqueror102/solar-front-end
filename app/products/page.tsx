"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/ProductCard"
import { FilterSidebar } from "@/components/FilterSidebar"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import { Filter, Grid, List } from "lucide-react"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    brand: "",
    wattage: "",
    inStock: false,
  })

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, Object.values(filters))

  const { data: products, isLoading, hasMore, loadMore } = useProducts(memoizedFilters)

  useEffect(() => {
    const category = searchParams.get("category")
    if (category && category !== filters.category) {
      setFilters((prev) => ({ ...prev, category }))
    }
  }, [searchParams, filters.category])

  if (isLoading && !products?.length) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="w-64 hidden lg:block">
              <div className="bg-gray-100 rounded-2xl h-96 loading-skeleton"></div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-80 loading-skeleton"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {filters.category
                ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1).replace("-", " ")}`
                : "All Products"}
            </h1>
            <p className="text-gray-600">{products?.length || 0} products found</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Mobile filter toggle */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* View mode toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`w-64 ${showFilters ? "block" : "hidden"} lg:block`}>
            <FilterSidebar filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
          </div>

          {/* Products */}
          <div className="flex-1">
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button onClick={loadMore} disabled={isLoading} size="lg" className="px-8">
                  {isLoading ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
