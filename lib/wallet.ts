export interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
}

export interface User {
  address: string
  balance: string
  joinedAt: Date
  isBlacklisted: boolean
}

// Avalanche network configuration
export const AVALANCHE_CONFIG = {
  chainId: 43114, // Avalanche C-Chain mainnnnnet
  chainName: "Avalanche Network",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://snowtrace.io/"],
}

export const AVALANCHE_TESTNET_CONFIG = {
  chainId: 43113, // Avalanche Fuji testnet
  chainName: "Avalanche Fuji Testnet",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
}

// Mock user data - in real app this would come from blockchain
export const mockUsers: Record<string, User> = {
  "0x1234567890123456789012345678901234567890": {
    address: "0x1234567890123456789012345678901234567890",
    balance: "10.5",
    joinedAt: new Date("2024-01-15"),
    isBlacklisted: false,
  },
  "0x9876543210987654321098765432109876543210": {
    address: "0x9876543210987654321098765432109876543210",
    balance: "25.8",
    joinedAt: new Date("2024-02-20"),
    isBlacklisted: false,
  },
}

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed")
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: "eth_chainId" })

    // If not on Avalanche, try to switch
    if (chainId !== "0xa86a" && chainId !== "0xa869") {
      // 43114 and 43113 in hex
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa86a" }], // Switch to Avalanche mainnet
        })
      } catch (switchError: any) {
        // If the chain hasn't been added to MetaMask, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xa86a",
                chainName: AVALANCHE_CONFIG.chainName,
                nativeCurrency: AVALANCHE_CONFIG.nativeCurrency,
                rpcUrls: AVALANCHE_CONFIG.rpcUrls,
                blockExplorerUrls: AVALANCHE_CONFIG.blockExplorerUrls,
              },
            ],
          })
        } else {
          throw switchError
        }
      }
    }

    return accounts[0]
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

export async function getBalance(address: string): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum) {
    return "0"
  }

  try {
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    })

    // Convert from wei to AVAX (simplified)
    const avaxBalance = Number.parseInt(balance, 16) / Math.pow(10, 18)
    return avaxBalance.toFixed(4)
  } catch (error) {
    console.error("Error getting balance:", error)
    return "0"
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
