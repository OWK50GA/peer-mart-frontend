"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Heart, Shield, Truck, CheckCircle, XCircle, AlertTriangle, Clock, User } from "lucide-react"
import { type Product, categories } from "@/lib/products"
import { useAuth } from "@/contexts/auth-context"
import { EscrowActions } from "./escrow-actions"
import { SellerInfo } from "./seller-info"
import { ProductReviews } from "./product-reviews"
import { ReportSellerModal } from "./report-seller-modal"
import { getOrdersForProduct } from "@/lib/escrow"
import Link from "next/link"

interface ProductDetailsPageProps {
  product: Product
}

export function ProductDetailsPage({ product }: ProductDetailsPageProps) {
  // const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const category = categories.find((c) => c.id === product.category)
  const orders = getOrdersForProduct(product.id)
  const userOrder = orders.find((order) => order.buyerAddress === user?.address)
  const isOwnProduct = product.seller.address === user?.address

  const getEscrowStatusInfo = () => {
    if (!userOrder) return null

    switch (userOrder.state) {
      case "pending":
        return {
          icon: Clock,
          text: "Payment Sent - Awaiting Delivery",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
        }
      case "delivered":
        return {
          icon: Truck,
          text: "Delivered - Please Confirm Receipt",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
        }
      case "confirmed":
        return {
          icon: CheckCircle,
          text: "Order Confirmed - Transaction Complete",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
        }
      case "disputed":
        return {
          icon: AlertTriangle,
          text: "Order Disputed - Under Review",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
        }
      case "cancelled":
        return {
          icon: XCircle,
          text: "Order Cancelled - Refund Processed",
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/20",
        }
      default:
        return null
    }
  }

  const escrowStatus = getEscrowStatusInfo()

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

        {/* Escrow Status Banner */}
        {escrowStatus && (
          <Card className={`mb-6 p-4 ${escrowStatus.bgColor} border ${escrowStatus.borderColor}`}>
            <div className="flex items-center">
              <escrowStatus.icon className={`h-5 w-5 ${escrowStatus.color} mr-3`} />
              <span className={`font-medium ${escrowStatus.color}`}>{escrowStatus.text}</span>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </Card>

            {product.images.length > 1 && (
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
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-500 text-black">{category?.name}</Badge>
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  {product.condition}
                </Badge>
                {product.inStock && (
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    In Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg text-gray-300 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
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
                <span className="text-4xl font-bold text-yellow-400">{product.price}</span>
                <span className="text-xl text-gray-400">(${product.priceUSD})</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Escrow Protection Info */}
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="font-semibold text-white">Escrow Protection</span>
              </div>
              <p className="text-sm text-gray-400">
                Your payment is held securely in escrow until you confirm delivery. Funds are only released to the
                seller after you approve the transaction.
              </p>
            </Card>

            {/* Action Buttons */}
            {!isOwnProduct && (
              <EscrowActions product={product} userOrder={userOrder} onReportSeller={() => setShowReportModal(true)} />
            )}

            {isOwnProduct && (
              <Card className="bg-blue-500/10 border-blue-500/20 p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium">This is your product listing</span>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border-gray-800">
              <TabsTrigger value="details" className="text-gray-300 data-[state=active]:text-yellow-400">
                Details
              </TabsTrigger>
              <TabsTrigger value="seller" className="text-gray-300 data-[state=active]:text-yellow-400">
                Seller Info
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-gray-300 data-[state=active]:text-yellow-400">
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger value="escrow" className="text-gray-300 data-[state=active]:text-yellow-400">
                Escrow History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card className="bg-gray-900/50 border-gray-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Condition:</span>
                    <span className="text-white ml-2 capitalize">{product.condition}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white ml-2">{category?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Listed:</span>
                    <span className="text-white ml-2">{product.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Stock:</span>
                    <span className="text-white ml-2">{product.inStock ? "Available" : "Out of Stock"}</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              <SellerInfo seller={product.seller} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product.id} />
            </TabsContent>

            <TabsContent value="escrow" className="mt-6">
              <Card className="bg-gray-900/50 border-gray-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
                {orders.length === 0 ? (
                  <p className="text-gray-400">No transactions yet for this product.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Order #{order.id}</span>
                          <Badge
                            variant="outline"
                            className={`
                              ${order.state === "confirmed" ? "border-green-500/30 text-green-400" : ""}
                              ${order.state === "pending" ? "border-yellow-500/30 text-yellow-400" : ""}
                              ${order.state === "delivered" ? "border-blue-500/30 text-blue-400" : ""}
                              ${order.state === "disputed" ? "border-red-500/30 text-red-400" : ""}
                            `}
                          >
                            {order.state}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300">
                          Amount: {order.amount} • {order.createdAt.toLocaleDateString()}
                        </div>
                        {order.transactionHash && (
                          <div className="text-xs text-gray-500 mt-1">TX: {order.transactionHash}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ReportSellerModal open={showReportModal} onOpenChange={setShowReportModal} product={product} />
    </div>
  )
}
