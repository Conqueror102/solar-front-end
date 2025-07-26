"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AddProductDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
  const { toast } = useToast()
  const [productName, setProductName] = useState("")
  const [sku, setSku] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")

  const handleAddProduct = () => {
    if (!productName || !sku || !category || !price || !stock) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required product fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate adding product to backend
    console.log("Adding product:", {
      productName,
      sku,
      category,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      description,
    })

    toast({
      title: "Product Added!",
      description: `${productName} has been successfully added.`,
    })

    // Clear form and close dialog
    setProductName("")
    setSku("")
    setCategory("")
    setPrice("")
    setStock("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productName" className="text-right">
              Product Name
            </Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              SKU
            </Label>
            <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solar Panels">Solar Panels</SelectItem>
                <SelectItem value="Inverters">Inverters</SelectItem>
                <SelectItem value="Batteries">Batteries</SelectItem>
                <SelectItem value="Controllers">Controllers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
