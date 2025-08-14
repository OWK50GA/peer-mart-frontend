"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, CheckCircle, XCircle, Flag, Loader2 } from "lucide-react"
import type { Product } from "@/lib/products"
import { type EscrowOrder, createEscrowOrder, confirmDelivery, disputeOrder } from "@/lib/escrow"
import { useAuth } from "@/contexts/auth-context"

interface EscrowActionsProps {
  product: Product
  userOrder?: EscrowOrder
  onReportSeller: () => void
}

export function EscrowActions({ product, userOrder, onReportSeller }: EscrowActionsProps) {
  // const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [disputeReason, setDisputeReason] = useState("")

  const handlePurchase = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await createEscrowOrder(product.id, user.address, product.seller.address, product.price, product.priceUSD)
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelivery = async () => {
    if (!userOrder) return

    setIsLoading(true)
    try {
      await confirmDelivery(userOrder.id)
      setShowConfirmDialog(false)
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      console.error("Confirmation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDispute = async () => {
    if (!userOrder || !disputeReason.trim()) return

    setIsLoading(true)
    try {
      await disputeOrder(userOrder.id, disputeReason)
      setShowDisputeDialog(false)
      setDisputeReason("")
      // Refresh page or update state
      window.location.reload()
    } catch (error) {
      console.error("Dispute failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // No order yet - show purchase button
  if (!userOrder) {
    return (
      <div className="space-y-4">
        <Button
          size="lg"
          className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold text-lg py-6"
          onClick={handlePurchase}
          disabled={isLoading || !product.inStock}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Buy Now with Escrow Protection
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onReportSeller}
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report Seller
        </Button>
      </div>
    )
  }

  // Order exists - show state-specific actions
  switch (userOrder.state) {
    case "pending":
      return (
        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Payment Sent</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your payment of {userOrder.amount} is held in escrow. The seller will be notified to ship your item.
            </p>
            <div className="text-xs text-gray-500">Transaction: {userOrder.transactionHash}</div>
          </div>
        </Card>
      )

    case "delivered":
      return (
        <div className="space-y-4">
          <Card className="bg-blue-500/10 border-blue-500/20 p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Item Delivered</h3>
              <p className="text-sm text-gray-300">
                The seller has marked your item as delivered. Please confirm receipt to release payment.
              </p>
              {userOrder.deliveryNotes && (
                <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
                  Delivery Notes: {userOrder.deliveryNotes}
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              size="lg"
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={() => setShowConfirmDialog(true)}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Confirm Receipt
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              onClick={() => setShowDisputeDialog(true)}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Dispute Order
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onReportSeller}
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <Flag className="mr-2 h-4 w-4" />
            Report Seller
          </Button>
        </div>
      )

    case "confirmed":
      return (
        <Card className="bg-green-500/10 border-green-500/20 p-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-400 mb-2">Order Complete</h3>
            <p className="text-sm text-gray-300">
              You confirmed receipt on {userOrder.confirmedAt?.toLocaleDateString()}. Payment has been released to the
              seller.
            </p>
          </div>
        </Card>
      )

    case "disputed":
      return (
        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Order Disputed</h3>
            <p className="text-sm text-gray-300 mb-2">
              Your dispute is under review. Our team will investigate and resolve this matter.
            </p>
            {userOrder.disputeReason && (
              <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
                Reason: {userOrder.disputeReason}
              </div>
            )}
          </div>
        </Card>
      )

    default:
      return null
  }

  // Confirmation Dialog
  return (
    <>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Receipt</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you received the item and are satisfied with your purchase? This action will release{" "}
              {userOrder.amount} to the seller and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleConfirmDelivery}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Confirm Receipt
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Dispute Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please explain why you're disputing this order. Our team will review your case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              placeholder="Describe the issue with your order..."
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
            <div className="flex gap-4">
              <Button
                onClick={handleDispute}
                disabled={isLoading || !disputeReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                Submit Dispute
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDisputeDialog(false)}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
