"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback } from "react"

interface FilterSidebarProps {
  filters: {
    category: string
    minPrice: number
    maxPrice: number
    brand: string
    wattage: string
    inStock: boolean
  }
  onFiltersChange: (filters: any) => void
  onClose?: () => void
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "solar-panels", label: "Solar Panels" },
  { value: "inverters", label: "Inverters" },
  { value: "batteries", label: "Batteries" },
  { value: "controllers", label: "Controllers" },
]

const brands = ["SolarMax", "PowerTech", "EcoSolar", "GreenEnergy", "SunPower", "Tesla", "LG", "Panasonic"]

const wattageRanges = [
  { value: "all", label: "All Wattages" },
  { value: "0-100", label: "0-100W" },
  { value: "100-300", label: "100-300W" },
  { value: "300-500", label: "300-500W" },
  { value: "500-1000", label: "500W-1kW" },
  { value: "1000+", label: "1kW+" },
]

export function FilterSidebar({ filters, onFiltersChange, onClose }: FilterSidebarProps) {
  const updateFilter = useCallback(
    (key: string, value: any) => {
      // Convert "all" back to empty string for filtering logic
      const filterValue = value === "all" ? "" : value
      onFiltersChange({ ...filters, [key]: filterValue })
    },
    [filters, onFiltersChange],
  )

  const clearFilters = useCallback(() => {
    onFiltersChange({
      category: "",
      minPrice: 0,
      maxPrice: 10000,
      brand: "",
      wattage: "",
      inStock: false,
    })
  }, [onFiltersChange])

  const handlePriceChange = useCallback(
    ([min, max]: [number, number]) => {
      onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
    },
    [filters, onFiltersChange],
  )

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
      {/* Mobile header */}
      {onClose && (
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {/* Category */}
        <div>
          <Label className="text-base font-medium mb-3 block">Category</Label>
          <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-base font-medium mb-3 block">
            Price Range: ${filters.minPrice} - ${filters.maxPrice}
          </Label>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Brand */}
        <div>
          <Label className="text-base font-medium mb-3 block">Brand</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) => updateFilter("brand", checked ? brand : "")}
                />
                <Label htmlFor={brand} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Wattage */}
        <div>
          <Label className="text-base font-medium mb-3 block">Wattage</Label>
          <Select value={filters.wattage || "all"} onValueChange={(value) => updateFilter("wattage", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select wattage" />
            </SelectTrigger>
            <SelectContent>
              {wattageRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilter("inStock", checked)}
          />
          <Label htmlFor="inStock" className="text-sm cursor-pointer">
            In Stock Only
          </Label>
        </div>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}
