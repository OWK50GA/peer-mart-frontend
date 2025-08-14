"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { connectWallet, getBalance, mockUsers, type WalletState, type User } from "@/lib/wallet"

interface AuthContextType {
  wallet: WalletState
  user: User | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
  })

  const [user, setUser] = useState<User | null>(null)

  const handleConnectWallet = async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true }))

    try {
      const address = await connectWallet()
      const balance = await getBalance(address)

      // Check if user exists in our mock database
      let userData = mockUsers[address]
      if (!userData) {
        // Create new user
        userData = {
          address,
          balance,
          joinedAt: new Date(),
          isBlacklisted: false,
        }
        mockUsers[address] = userData
      } else {
        // Update balance
        userData.balance = balance
      }

      setWallet({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: 43114, // Avalanche mainnet
      })

      setUser(userData)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setWallet((prev) => ({ ...prev, isConnecting: false }))
    }
  }

  const handleDisconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
    })
    setUser(null)
  }

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            const address = accounts[0]
            const balance = await getBalance(address)

            let userData = mockUsers[address]
            if (!userData) {
              userData = {
                address,
                balance,
                joinedAt: new Date(),
                isBlacklisted: false,
              }
              mockUsers[address] = userData
            } else {
              userData.balance = balance
            }

            setWallet({
              address,
              isConnected: true,
              isConnecting: false,
              chainId: 43114,
            })
            setUser(userData)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          handleDisconnectWallet()
        } else {
          handleConnectWallet()
        }
      }

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  const value: AuthContextType = {
    wallet,
    user,
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    isAuthenticated: wallet.isConnected && user !== null && !user.isBlacklisted,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
