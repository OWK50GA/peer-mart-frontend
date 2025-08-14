import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, User, Calendar, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/products"

interface SellerInfoProps {
  seller: Product["seller"]
}

export function SellerInfo({ seller }: SellerInfoProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-black" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-white">{seller.name}</h3>
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              Verified
            </Badge>
          </div>

          <div className="text-sm text-gray-400 mb-3">Wallet: {formatAddress(seller.address)}</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-2" />
              <span className="text-white font-medium">{seller.rating}</span>
              <span className="text-gray-400 ml-1">rating</span>
            </div>
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-white font-medium">{seller.totalSales}</span>
              <span className="text-gray-400 ml-1">sales</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Member since January 2024
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              View Other Items
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
