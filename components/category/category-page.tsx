"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { mockProducts, type Product, type Category } from "@/lib/products"
import Link from "next/link"

interface CategoryPageProps {
  category: Category
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState("all")
  const [condition, setCondition] = useState("all")

  const categoryProducts = useMemo(() => {
    return mockProducts.filter((product) => product.category === category.id)
  }, [category.id])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = categoryProducts

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

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-10":
          filtered = filtered.filter((product) => product.priceUSD < 10)
          break
        case "10-50":
          filtered = filtered.filter((product) => product.priceUSD >= 10 && product.priceUSD <= 50)
          break
        case "over-50":
          filtered = filtered.filter((product) => product.priceUSD > 50)
          break
      }
    }

    // Filter by condition
    if (condition !== "all") {
      filtered = filtered.filter((product) => product.condition === condition)
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
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return filtered
  }, [categoryProducts, searchQuery, sortBy, priceRange, condition])

  const handleProductClick = (product: Product) => {
    // Navigate to product details (will implement in next task)
    console.log("Navigate to product:", product.id)
  }

  return (
    <div className="min-h-screen bg-premium-gradient">
      {/* Category Hero Section */}
      <section className="relative py-16 px-6 lg:px-8 bg-black/40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Products
            </Link>
          </div>

          <div className="text-center">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-5xl font-bold text-white mb-4">{category.name}</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">{category.description}</p>
            <Badge
              variant="secondary"
              className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-lg px-4 py-2"
            >
              {categoryProducts.length} Products Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 px-6 lg:px-8 bg-black/20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search in ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-800 text-white placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-800 text-white">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-10">Under $10</SelectItem>
                  <SelectItem value="10-50">$10 - $50</SelectItem>
                  <SelectItem value="over-50">Over $50</SelectItem>
                </SelectContent>
              </Select>

              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-800 text-white">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-900/50 border-gray-800 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-800 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="text-gray-400">
              Showing {filteredAndSortedProducts.length} of {categoryProducts.length} products
              {searchQuery && <span> for "{searchQuery}"</span>}
            </div>

            {/* Active filters */}
            <div className="flex flex-wrap gap-2">
              {priceRange !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 cursor-pointer"
                  onClick={() => setPriceRange("all")}
                >
                  {priceRange === "under-10" && "Under $10"}
                  {priceRange === "10-50" && "$10-$50"}
                  {priceRange === "over-50" && "Over $50"}×
                </Badge>
              )}
              {condition !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 cursor-pointer"
                  onClick={() => setCondition("all")}
                >
                  {condition} ×
                </Badge>
              )}
            </div>
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
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setPriceRange("all")
                  setCondition("all")
                }}
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  viewMode={viewMode}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Stats */}
      <section className="py-16 px-6 lg:px-8 bg-black/20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">{categoryProducts.length}</div>
              <div className="text-sm text-gray-400">Total Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {new Set(categoryProducts.map((p) => p.seller.address)).size}
              </div>
              <div className="text-sm text-gray-400">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {(categoryProducts.reduce((sum, p) => sum + p.rating, 0) / categoryProducts.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {categoryProducts.filter((p) => p.condition === "new").length}
              </div>
              <div className="text-sm text-gray-400">New Items</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  onClick: () => void
}

function ProductCard({ product, viewMode, onClick }: ProductCardProps) {
  const handleClick = () => {
    window.location.href = `/product/${product.id}`
  }

  if (viewMode === "list") {
    return (
      <Card
        className="bg-gray-900/50 border-gray-800 p-6 cursor-pointer hover:bg-gray-900/70 transition-all"
        onClick={handleClick}
      >
        <div className="flex gap-6">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-white hover:text-yellow-400 transition-colors">
                {product.name}
              </h3>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-400 mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300 ml-1">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                {product.condition}
              </Badge>
              <div className="text-sm text-gray-400">by {product.seller.name}</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-yellow-400">{product.price}</span>
                <span className="text-sm text-gray-400 ml-2">(${product.priceUSD})</span>
              </div>
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="bg-gray-900/50 border-gray-800 overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button size="sm" variant="ghost" className="absolute top-2 right-2 text-white hover:text-yellow-400">
          <Heart className="h-4 w-4" />
        </Button>
        {product.condition !== "new" && (
          <Badge variant="outline" className="absolute bottom-2 left-2 border-green-500/30 text-green-400 bg-black/50">
            {product.condition}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-yellow-400">{product.price}</span>
            <div className="text-xs text-gray-500">${product.priceUSD}</div>
          </div>
          <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Buy
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-500">by {product.seller.name}</div>
      </div>
    </Card>
  )
}
