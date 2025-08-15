"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useActiveAccount, useReadContract } from "thirdweb/react"
import { getContract } from "thirdweb"
import { client } from "@/contexts/thirdwebclient"
import { avalancheFuji } from "thirdweb/chains"
import { ECommerceAddress } from "@/lib/abi/ecommerce-abi"

export function ProductsDisplay() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const account = useActiveAccount()
  
  const contract = getContract({
    client: client,
    chain: avalancheFuji,
    address: ECommerceAddress
  })

  // Fetch total product count
  const { data: productCount, isLoading: countLoading } = useReadContract({
    contract,
    method: "function productCount() view returns (uint256)"
  })

  if (countLoading) {
    return <div className="text-center text-white py-8">Loading products...</div>
  }

  if (!productCount || Number(productCount) === 0) {
    return <div className="text-center text-white py-8">No products found</div>
  }

  return (
    <div className="min-h-screen bg-premium-gradient py-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {Array.from({ length: Number(productCount) }).map((_, index) => (
            <ProductFetcher key={index} productId={index + 1} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ProductFetcherProps {
  productId: number
  viewMode: "grid" | "list"
}

function ProductFetcher({ productId, viewMode }: ProductFetcherProps) {
  const contract = getContract({
    client: client,
    chain: avalancheFuji,
    address: ECommerceAddress
  })

  const { data: product, isLoading } = useReadContract({
    contract,
    method:
      "function products(uint) view returns (uint256 id, string name, string imageUrl, uint256 price, address seller, string sellerName, string description, uint256 inventory, uint256 totalSold)",
    params: [BigInt(productId)]
  })
  console.log(product)

  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-6 text-center text-gray-400">
        Loading product #{productId}...
      </Card>
    )
  }

  if (!product) return null

  return <ProductCard product={product} viewMode={viewMode} />
}

interface ProductCardProps {
  product: any // You can type this properly
  viewMode: "grid" | "list"
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const handleClick = () => {
    window.location.href = `/product/${(product[0]).toString()}`
  }
  console.log(product[0])

  if (viewMode === "list") {
    return (
      <Card
        className="bg-gray-900/50 border-gray-800 p-6 cursor-pointer hover:bg-gray-900/70 transition-all"
        onClick={handleClick}
      >
        <h2 className="text-white text-lg font-semibold">{product[1].toString()}</h2>
        <p className="text-gray-400">{product[6]}</p>
        <p className="text-yellow-400 font-bold">{Number(product[3])} wei</p>
      </Card>
    )
  }

  return (
    <Card
      className="bg-gray-900/50 border-gray-800 overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      <img src={product[2]} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-white text-lg font-semibold">{product[1].toString()}</h2>
        <p className="text-gray-400">{product[6]}</p>
        <p className="text-yellow-400 font-bold">{Number(product[3])} wei</p>
      </div>
    </Card>
  )
}
