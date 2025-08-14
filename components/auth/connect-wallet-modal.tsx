"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ConnectWalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectWalletModal({ open, onOpenChange }: ConnectWalletModalProps) {
  // const { connectWallet, wallet } = useAuth()
  const connectWallet = () => {};
  const wallet = {
    isConnecting: true
  };
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setError(null)
      await connectWallet()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Connect your wallet to access the marketplace and start trading securely on Avalanche.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">MetaMask</h3>
                <p className="text-sm text-gray-400">Connect using MetaMask wallet</p>
              </div>
            </div>

            <Button
              onClick={handleConnect}
              // disabled={wallet.isConnecting}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold"
            >
              {wallet.isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect MetaMask"
              )}
            </Button>
          </Card>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>Don't have MetaMask?</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              Download it here
            </a>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Network Requirements</p>
                <p>
                  This dApp requires connection to the Avalanche network. We'll help you add it to MetaMask if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
