"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ConnectWalletModal } from "@/components/auth/connect-wallet-modal"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProductPreview() {
  // const { isAuthenticated } = useAuth()
  const isAuthenticated = true
  const [showConnectModal, setShowConnectModal] = useState(false)
  const router = useRouter()

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: "0.5 AVAX",
      image: "/premium-wireless-headphones.png",
      rating: 4.8,
      reviews: 124,
      category: "Electronics",
      seller: "0x1234...5678",
    },
    {
      id: 2,
      name: "Handcrafted Leather Wallet",
      price: "0.2 AVAX",
      image: "/luxury-leather-wallet.png",
      rating: 4.9,
      reviews: 89,
      category: "Fashion",
      seller: "0x9876...5432",
    },
    {
      id: 3,
      name: "Smart Home Security Camera",
      price: "0.8 AVAX",
      image: "/smart-security-camera.png",
      rating: 4.7,
      reviews: 156,
      category: "Smart Home",
      seller: "0x5555...1111",
    },
    {
      id: 4,
      name: "Artisan Coffee Beans",
      price: "0.1 AVAX",
      image: "/placeholder-z9one.png",
      rating: 4.6,
      reviews: 203,
      category: "Food & Beverage",
      seller: "0x7777...9999",
    },
  ]

  const handleProductClick = () => {
    if (!isAuthenticated) {
      setShowConnectModal(true)
    } else {
      // Navigate to products page instead of showing modal
      router.push("/products")
    }
  }

  const handleViewAllClick = () => {
    if (!isAuthenticated) {
      setShowConnectModal(true)
    } else {
      // Navigate to products page
      router.push("/products")
    }
  }

  return (
    <section className="py-24 px-6 lg:px-8 bg-black/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-xl text-gray-300">Discover amazing products from verified sellers worldwide</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-gray-900/50 border-gray-800 overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer"
              onClick={handleProductClick}
            >
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button size="sm" variant="ghost" className="absolute top-2 right-2 text-white hover:text-yellow-400">
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">{product.category}</Badge>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-300 ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-yellow-400">{product.price}</span>
                  <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Buy
                  </Button>
                </div>

                <div className="mt-2 text-xs text-gray-500">Seller: {product.seller}</div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
            onClick={handleViewAllClick}
          >
            View All Products
          </Button>
        </div>
      </div>

      <ConnectWalletModal open={showConnectModal} onOpenChange={setShowConnectModal} />
    </section>
  )
}
