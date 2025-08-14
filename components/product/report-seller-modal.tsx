"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { Product } from "@/lib/products"
import { reportSeller, type SellerReport } from "@/lib/escrow"
import { useAuth } from "@/contexts/auth-context"

interface ReportSellerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ReportSellerModal({ open, onOpenChange, product }: ReportSellerModalProps) {
  // const { user } = useAuth()
  const [reason, setReason] = useState<SellerReport["reason"] | "">("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user || !reason || !description.trim()) return

    setIsLoading(true)
    try {
      await reportSeller(
        user.address,
        product.seller.address,
        product.id,
        reason as SellerReport["reason"],
        description,
      )

      // Reset form and close modal
      setReason("")
      setDescription("")
      onOpenChange(false)

      // Show success message (you could add a toast here)
      alert("Report submitted successfully. Our team will review it.")
    } catch (error) {
      console.error("Failed to submit report:", error)
      alert("Failed to submit report. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setReason("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            Report Seller
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Report {product.seller.name} for policy violations. All reports are reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Reason for Report</label>
            <Select value={reason} onValueChange={(value) => setReason(value as SellerReport["reason"])}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                <SelectItem value="fake_product">Fake/Counterfeit Product</SelectItem>
                <SelectItem value="no_delivery">No Delivery</SelectItem>
                <SelectItem value="poor_quality">Poor Quality/Not as Described</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
            <Textarea
              placeholder="Please provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              rows={4}
            />
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 mr-2" />
              <div className="text-sm text-red-300">
                <p className="font-medium mb-1">Important</p>
                <p>False reports may result in account suspension. Only report genuine policy violations.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !reason || !description.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-600 text-gray-300 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
