"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { ConnectWalletModal } from "./connect-wallet-modal"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, wallet, user } = useAuth()
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give some time for wallet connection to be checked
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isAuthenticated) {
        setShowConnectModal(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-premium-gradient flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-white">Checking wallet connection...</p>
        </Card>
      </div>
    )
  }

  if (user?.isBlacklisted) {
    return (
      <div className="min-h-screen bg-premium-gradient flex items-center justify-center p-4">
        <Card className="bg-gray-900/50 border-red-800 p-8 text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Account Suspended</h2>
          <p className="text-gray-300">
            Your account has been suspended due to policy violations. Please contact support for assistance.
          </p>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-premium-gradient flex items-center justify-center p-4">
            <Card className="bg-gray-900/50 border-gray-800 p-8 text-center max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-gray-300 mb-6">
                Please connect your wallet to access this page and start trading on our secure marketplace.
              </p>
            </Card>
          </div>
        )}
        <ConnectWalletModal open={showConnectModal} onOpenChange={setShowConnectModal} />
      </>
    )
  }

  return <>{children}</>
}
