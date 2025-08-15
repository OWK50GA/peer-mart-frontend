"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Heart, Shield, User } from "lucide-react"
import { type Product, categories } from "@/lib/products"
import Link from "next/link"
import { SellerInfo } from "./seller-info"
import { ProductReviews } from "./product-reviews"
import { getContract } from "thirdweb"
import { client } from "@/contexts/thirdwebclient"
import { avalancheFuji } from "thirdweb/chains"
import { ECommerceAddress } from "@/lib/abi/ecommerce-abi"
import { useReadContract } from "thirdweb/react"

interface ProductDetailsPageProps {
  productId: number
}

export function ProductDetailsPage({ productId }: ProductDetailsPageProps) {

  const contract = getContract({
      client: client,
      chain: avalancheFuji,
      address: ECommerceAddress
  });

  const { data: product, isLoading } = useReadContract({
    contract,
    method:
      "function products(uint) view returns (uint256 id, string name, string imageUrl, uint256 price, address seller, string sellerName, string description, uint256 inventory, uint256 totalSold)",
    params: [BigInt(productId)]
  })

  const refineProduct = () => {
    if (!product) return;

    return {
      id: Number(product[0]),
      name: product[1],
      imageUrl: product[2],
      price: product[3],
      seller: product[4],
      sellerName: product[5],
      description: product[6],
      inventory: product[7],
      totalSold: product[8]
    }
  }
  const refinedProduct = refineProduct();

  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // const category = categories.find((c) => c.id === product.category)

  return (
    <div className="min-h-screen bg-premium-gradient">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <img
                src={refinedProduct?.imageUrl || "/placeholder.svg"}
                alt={refinedProduct?.name}
                className="w-full h-96 object-cover"
              />
            </Card>
            <Button>
              Purchase Product
            </Button>

            {/* {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    className={`bg-gray-900/50 border-gray-800 overflow-hidden cursor-pointer transition-all ${
                      selectedImage === index ? "ring-2 ring-yellow-500" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </Card>
                ))}
              </div>
            )} */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {/* <Badge className="bg-yellow-500 text-black">{}</Badge> */}
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {"New"}
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  In Stock
                </Badge>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{refinedProduct?.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  {/* <span className="text-lg text-gray-300 ml-2">
                    {refinedProduct?.rating} ({product.reviews} reviews)
                  </span> */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`${isWishlisted ? "text-red-400" : "text-gray-400"} hover:text-red-400`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-yellow-400">{refinedProduct?.price}</span>
                {/* <span className="text-xl text-gray-400">(${product.priceUSD})</span> */}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">{refinedProduct?.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {/* {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))} */}
              </div>
            </div>

            {/* Info Card */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="font-semibold text-white">Buyer Protection</span>
              </div>
              <p className="text-sm text-gray-400">
                This product is covered by our buyer protection policy.
              </p>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border-gray-800">
              <TabsTrigger value="details" className="text-gray-300 data-[state=active]:text-yellow-400">
                Details
              </TabsTrigger>
              <TabsTrigger value="seller" className="text-gray-300 data-[state=active]:text-yellow-400">
                Seller Info
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-gray-300 data-[state=active]:text-yellow-400">
                {/* Reviews ({product.reviews}) */}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card className="bg-gray-900/50 border-gray-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Condition:</span>
                    {/* <span className="text-white ml-2 capitalize">{product.condition}</span> */}
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    {/* <span className="text-white ml-2">{category?.name}</span> */}
                  </div>
                  <div>
                    <span className="text-gray-400">Listed:</span>
                    {/* <span className="text-white ml-2">{product.createdAt.toLocaleDateString()}</span> */}
                  </div>
                  <div>
                    <span className="text-gray-400">Stock:</span>
                    {/* <span className="text-white ml-2">{product.inStock ? "Available" : "Out of Stock"}</span> */}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              {/* <SellerInfo seller={refinedProduct?.seller} /> */}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={(refinedProduct?.id)?.toString()!} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
