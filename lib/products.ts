export interface Product {
  id: string
  name: string
  description: string
  price: string
  priceUSD: number
  images: string[]
  category: string
  seller: {
    address: string
    name: string
    rating: number
    totalSales: number
  }
  rating: number
  reviews: number
  inStock: boolean
  createdAt: Date
  tags: string[]
  condition: "new" | "used" | "refurbished"
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  productCount: number
  image: string
}

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets and electronic devices",
    icon: "📱",
    productCount: 156,
    image: "/headphone.png",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Clothing, accessories, and style",
    icon: "👕",
    productCount: 89,
    image: "/brown-handbag.png",
  },
  // {
  //   id: "fashion",
  //   name: "Fashion",
  //   description: "Accessories, Men's shades",
  //   icon: "🏠",
  //   productCount: 124,
  //   image: "/white-shades",
  // },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Sports equipment and fitness gear",
    icon: "⚽",
    productCount: 67,
    image: "/nike-gray-running-shoe.png",
  },
  {
    id: "books",
    name: "Books & Media",
    description: "Books, movies, music, and more",
    icon: "📚",
    productCount: 203,
    image: "/white-smartwatch.png",
  },
  {
    id: "food",
    name: "Food & Beverage",
    description: "Gourmet food and specialty drinks",
    icon: "🍕",
    productCount: 78,
    image: "/wine.png",
  },
  {
    id: "art",
    name: "Collectibles",
    description: "Unique art pieces and collectibles",
    icon: "🎨",
    productCount: 92,
    image: "/placeholder-oltyl.png",
  },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: "0.5 AVAX",
    priceUSD: 25.5,
    images: ["/premium-wireless-headphones.png"],
    category: "electronics",
    seller: {
      address: "0x1234567890123456789012345678901234567890",
      name: "TechStore Pro",
      rating: 4.8,
      totalSales: 156,
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    createdAt: new Date("2024-01-15"),
    tags: ["wireless", "headphones", "audio", "premium"],
    condition: "new",
  },
  {
    id: "2",
    name: "Handcrafted Leather Wallet",
    description:
      "Genuine leather wallet handcrafted by skilled artisans. Features multiple card slots and a secure coin pocket.",
    price: "0.2 AVAX",
    priceUSD: 10.2,
    images: ["/luxury-leather-wallet.png"],
    category: "fashion",
    seller: {
      address: "0x9876543210987654321098765432109876543210",
      name: "Artisan Leather Co",
      rating: 4.9,
      totalSales: 89,
    },
    rating: 4.9,
    reviews: 89,
    inStock: true,
    createdAt: new Date("2024-01-20"),
    tags: ["leather", "wallet", "handcrafted", "accessories"],
    condition: "new",
  },
  {
    id: "3",
    name: "Smart Home Security Camera",
    description:
      "Advanced security camera with AI detection, night vision, and mobile app integration. Keep your home safe 24/7.",
    price: "0.8 AVAX",
    priceUSD: 40.8,
    images: ["/smart-security-camera.png"],
    category: "electronics",
    seller: {
      address: "0x5555555555555555555555555555555555555555",
      name: "SecureHome Tech",
      rating: 4.7,
      totalSales: 203,
    },
    rating: 4.7,
    reviews: 156,
    inStock: true,
    createdAt: new Date("2024-02-01"),
    tags: ["security", "camera", "smart home", "AI"],
    condition: "new",
  },
  {
    id: "4",
    name: "Artisan Coffee Beans",
    description: "Premium single-origin coffee beans roasted to perfection. Sourced directly from sustainable farms.",
    price: "0.1 AVAX",
    priceUSD: 5.1,
    images: ["/placeholder-od7x8.png"],
    category: "food",
    seller: {
      address: "0x7777777777777777777777777777777777777777",
      name: "Mountain Coffee Co",
      rating: 4.6,
      totalSales: 312,
    },
    rating: 4.6,
    reviews: 203,
    inStock: true,
    createdAt: new Date("2024-02-05"),
    tags: ["coffee", "organic", "artisan", "single-origin"],
    condition: "new",
  },
  {
    id: "5",
    name: "Vintage Vinyl Record Collection",
    description:
      "Rare collection of vintage vinyl records from the 70s and 80s. Perfect condition, carefully preserved.",
    price: "1.2 AVAX",
    priceUSD: 61.2,
    images: ["/vintage-vinyl-records.png"],
    category: "books",
    seller: {
      address: "0x3333333333333333333333333333333333333333",
      name: "Vinyl Vault",
      rating: 4.9,
      totalSales: 67,
    },
    rating: 4.9,
    reviews: 45,
    inStock: true,
    createdAt: new Date("2024-01-10"),
    tags: ["vinyl", "music", "vintage", "collectible"],
    condition: "used",
  },
  {
    id: "6",
    name: "Professional Yoga Mat",
    description: "Eco-friendly yoga mat with superior grip and cushioning. Perfect for all types of yoga practice.",
    price: "0.15 AVAX",
    priceUSD: 7.65,
    images: ["/professional-yoga-mat.png"],
    category: "sports",
    seller: {
      address: "0x4444444444444444444444444444444444444444",
      name: "Zen Fitness",
      rating: 4.7,
      totalSales: 189,
    },
    rating: 4.7,
    reviews: 134,
    inStock: true,
    createdAt: new Date("2024-02-10"),
    tags: ["yoga", "fitness", "eco-friendly", "exercise"],
    condition: "new",
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  return mockProducts.filter((product) => product.category === categoryId)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((product) => product.id === id)
}
