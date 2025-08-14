"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { categories, mockProducts, type Product } from "@/lib/products"
import Link from "next/link"

export function ProductsDisplay() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.priceUSD - b.priceUSD)
        break
      case "price-high":
        filtered.sort((a, b) => b.priceUSD - a.priceUSD)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-premium-gradient">
      {/* Categories Section */}
      <section className="py-12 px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Browse Products</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card
                  className={`bg-gray-900/50 border-gray-800 p-4 text-center cursor-pointer transition-all hover:bg-gray-900/70 ${
                    selectedCategory === category.id ? "ring-2 ring-yellow-500" : ""
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="text-sm font-medium text-white mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-400">{category.productCount}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  // Updated to navigate to product details page
  const handleClick = () => {
    window.location.href = `/product/${product.id}`
  }

  if (viewMode === "list") {
    return (
      <Card
        className="bg-gray-900/50 border-gray-800 p-6 cursor-pointer hover:bg-gray-900/70 transition-all"
        onClick={handleClick}
      ></Card>
    )
  }

  return (
    <Card
      className="bg-gray-900/50 border-gray-800 overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    ></Card>
  )
}
