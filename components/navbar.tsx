"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConnectWalletModal } from "@/components/auth/connect-wallet-modal"
import { UserProfile } from "@/components/auth/user-profile"
// import { useAuth } from "@/contexts/auth-context"
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { categories } from "@/lib/products"
import Link from "next/link"
import { CustomConnectButton } from "./connectButton"


export function Navbar() {
  // const { isAuthenticated } = useAuth()
  const isAuthenticated = false;
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold text-white cursor-pointer">
                  Peer<span className="text-yellow-400">Mart</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Browse
                </Link>

                {/* Categories Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Categories
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          href={`/category/${category.id}`}
                          className="flex items-center px-3 py-2 hover:bg-gray-800 cursor-pointer"
                        >
                          <span className="mr-3 text-lg">{category.icon}</span>
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-gray-400">{category.productCount} items</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  href="/sell"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sell
                </Link>

                {isAuthenticated && (
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors flex items-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Cart
                </Link>

                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </a>
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                <Search className="h-4 w-4" />
              </Button>

              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-yellow-400">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}

              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <CustomConnectButton />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/products"
                className="text-gray-300 hover:text-yellow-400 block px-3 py-2 text-base font-medium"
              >
                Browse
              </Link>

              {/* Mobile Categories */}
              <div className="px-3 py-2">
                <div className="text-gray-300 font-medium mb-2">Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className="flex items-center text-sm text-gray-400 hover:text-yellow-400 py-1"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/sell" className="text-gray-300 hover:text-yellow-400 block px-3 py-2 text-base font-medium">
                Sell
              </Link>

              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-yellow-400 block px-3 py-2 text-base font-medium"
                >
                  Dashboard
                </Link>
              )}

              <Link
                href="/cart"
                className="text-gray-300 hover:text-yellow-400 px-3 py-2 text-base font-medium flex items-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
              </Link>

              <a href="#" className="text-gray-300 hover:text-yellow-400 block px-3 py-2 text-base font-medium">
                About
              </a>

              <div className="pt-4 pb-3 border-t border-gray-800">
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <CustomConnectButton />
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <ConnectWalletModal open={showConnectModal} onOpenChange={setShowConnectModal} />
    </>
  )
}
