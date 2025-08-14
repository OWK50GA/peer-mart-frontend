"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, ShoppingBag, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function UserProfile() {
  // const { user, wallet, disconnectWallet } = useAuth()
  const user = {}
  const wallet = {
    isConnected: true,

  }
  const disconnectWallet = () => {};

  if (!user || !wallet.isConnected) {
    return null
  }

  const formatAddress = (address: string) => {
    return `${address?.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-yellow-400">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-black" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{ /* formatAddress(user.address) */ " "}</div>
            {/* <div className="text-xs text-gray-400">{user.balance} AVAX</div> */}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 bg-gray-900 border-gray-800 text-white" align="end">
        <div className="p-4">
          <Card className="bg-gray-800/50 border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-black" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{ /*formatAddress(user.address) */ " "}</div>
                {/* <div className="text-sm text-gray-400">Member since { /user.joinedAt.toLocaleDateString()}</div> */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                {/* <div className="text-2xl font-bold text-yellow-400">{user.balance} AVAX</div> */}
                <div className="text-sm text-gray-400">Wallet Balance</div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                Active
              </Badge>
            </div>
          </Card>
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />

        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <ShoppingBag className="mr-2 h-4 w-4" />
          My Orders
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/sell" className="text-white hover:bg-gray-800 cursor-pointer flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            Sell Products
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-white hover:bg-gray-800 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-800" />

        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 cursor-pointer" onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
