"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Star, ShoppingCart, Heart, Share2, Zap, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProduct } from "@/hooks/useProduct"
import { useCart } from "@/hooks/useCart"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const { data: product, isLoading } = useProduct(slug)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    })

    setIsAddingToCart(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-2xl loading-skeleton"></div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg loading-skeleton"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded loading-skeleton"></div>
              <div className="h-12 bg-gray-200 rounded loading-skeleton"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 loading-skeleton"></div>
              <div className="h-32 bg-gray-200 rounded loading-skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace("-", " ")}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">-{product.discount}% OFF</Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.featured && <Badge className="bg-accent text-black">Featured</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
              <div className="text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium">{product.wattage}W</div>
                <div className="text-sm text-gray-600">Power Output</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium">25 Years</div>
                <div className="text-sm text-gray-600">Warranty</div>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-medium">Free</div>
                <div className="text-sm text-gray-600">Shipping</div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.inStock}
                  className="flex-1 bg-accent text-black hover:bg-accent/90 font-semibold py-3 rounded-2xl"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button variant="outline" size="lg" className="px-6 rounded-2xl bg-transparent">
                  <Heart className="w-5 h-5" />
                </Button>

                <Button variant="outline" size="lg" className="px-6 rounded-2xl bg-transparent">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {product.inStock && <p className="text-green-600 text-sm">✓ In stock and ready to ship</p>}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-bold mb-4">Product Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                <h4 className="text-xl font-semibold mb-3">Key Features</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {product.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
                  <div className="space-y-3">
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-900">{key}:</span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-4">Dimensions & Weight</h4>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span>{product.dimensions?.length || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span>{product.dimensions?.width || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Height:</span>
                        <span>{product.dimensions?.height || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span>{product.weight || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{product.rating}</div>
                    <div className="flex items-center justify-center mb-2">{renderStars(product.rating)}</div>
                    <div className="text-gray-600">{product.reviews} reviews</div>
                  </div>

                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2 mb-2">
                        <span className="w-3">{stars}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="font-medium">Customer {index + 1}</div>
                          <div className="flex items-center gap-2">
                            {renderStars(5)}
                            <span className="text-sm text-gray-600">2 days ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Great product! Excellent quality and fast shipping. Would definitely recommend to others.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
