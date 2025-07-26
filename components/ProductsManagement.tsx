"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Eye, Package, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { AddProductDialog } from "./AddProductDialog"

const mockProducts = [
  {
    id: "1",
    name: "SolarMax Pro 400W Solar Panel",
    sku: "SM-400W-PRO",
    category: "Solar Panels",
    price: 299,
    stock: 45,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    featured: true,
  },
  {
    id: "2",
    name: "PowerTech 3000W Inverter",
    sku: "PT-3000W-INV",
    category: "Inverters",
    price: 599,
    stock: 23,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    featured: false,
  },
  {
    id: "3",
    name: "EcoSolar 200Ah Battery",
    sku: "ES-200AH-BAT",
    category: "Batteries",
    price: 899,
    stock: 8,
    status: "active",
    image: "/placeholder.svg?height=60&width=60",
    featured: true,
  },
  {
    id: "4",
    name: "GreenEnergy MPPT Controller",
    sku: "GE-MPPT-60A",
    category: "Controllers",
    price: 199,
    stock: 0,
    status: "inactive",
    image: "/placeholder.svg?height=60&width=60",
    featured: false,
  },
]

export function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const { toast } = useToast()
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your solar product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast({ title: "Import Products", description: "Import functionality would be triggered here." })
            }
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsAddProductDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Solar Panels">Solar Panels</SelectItem>
                <SelectItem value="Inverters">Inverters</SelectItem>
                <SelectItem value="Batteries">Batteries</SelectItem>
                <SelectItem value="Controllers">Controllers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedProducts.length} product(s) selected</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({ title: "Bulk Edit", description: `Editing ${selectedProducts.length} selected products.` })
                  }
                >
                  Bulk Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Update Stock",
                      description: `Updating stock for ${selectedProducts.length} selected products.`,
                    })
                  }
                >
                  Update Stock
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    toast({
                      title: "Delete Selected",
                      description: `Deleting ${selectedProducts.length} selected products.`,
                    })
                  }
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Stock Alert", description: "Generating stock alert report." })}
              >
                <Package className="w-4 h-4 mr-2" />
                Stock Alert
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={selectedProducts.length === filteredProducts.length}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          {product.featured && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
                    <td className="py-4 px-4 text-gray-600">{product.category}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-gray-900">${product.price.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock < 10
                              ? "text-orange-600"
                              : "text-gray-900"
                        }`}
                      >
                        {product.stock}
                      </span>
                      {product.stock < 10 && product.stock > 0 && (
                        <Badge variant="outline" className="ml-2 text-xs text-orange-600 border-orange-600">
                          Low Stock
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={product.status === "active" ? "default" : "secondary"}
                        className={
                          product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast({ title: "View Product", description: `Viewing details for ${product.name}.` })
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast({ title: "Edit Product", description: `Editing product ${product.name}.` })
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() =>
                            toast({ title: "Delete Product", description: `Deleting product ${product.name}.` })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <AddProductDialog isOpen={isAddProductDialogOpen} onClose={() => setIsAddProductDialogOpen(false)} />
    </div>
  )
}
