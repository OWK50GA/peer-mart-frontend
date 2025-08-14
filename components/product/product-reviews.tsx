import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User } from "lucide-react"

interface ProductReviewsProps {
  productId: string
}

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    userName: "CryptoTrader123",
    userAddress: "0x1234...5678",
    rating: 5,
    comment:
      "Excellent product! Exactly as described and shipped quickly. The escrow system made me feel secure about the purchase.",
    date: new Date("2024-01-20"),
    verified: true,
  },
  {
    id: "2",
    userName: "BlockchainBuyer",
    userAddress: "0x9876...5432",
    rating: 4,
    comment: "Good quality item. Seller was responsive and delivery was on time. Would buy again.",
    date: new Date("2024-01-15"),
    verified: true,
  },
  {
    id: "3",
    userName: "AVAXUser",
    userAddress: "0x5555...1111",
    rating: 5,
    comment:
      "Amazing experience! The product exceeded my expectations and the blockchain escrow gave me peace of mind.",
    date: new Date("2024-01-10"),
    verified: false,
  },
]

export function ProductReviews({ productId }: ProductReviewsProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">4.8</div>
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="text-sm text-gray-400">Based on {mockReviews.length} reviews</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-gray-400 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: rating === 5 ? "60%" : rating === 4 ? "30%" : "10%" }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">{rating === 5 ? "60%" : rating === 4 ? "30%" : "10%"}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-sm text-gray-400">Verified Purchases</div>
          </div>
        </div>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id} className="bg-gray-900/50 border-gray-800 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-black" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-white">{review.userName}</span>
                  <span className="text-xs text-gray-500">{formatAddress(review.userAddress)}</span>
                  {review.verified && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">{review.date.toLocaleDateString()}</span>
                </div>

                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
