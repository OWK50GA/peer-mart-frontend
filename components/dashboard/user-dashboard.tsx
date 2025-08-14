"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wallet, ShoppingBag, Package, Star, Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockOrders = [
  {
    id: "1",
    productName: "Premium Wireless Headphones",
    price: "0.5 AVAX",
    status: "delivered",
    date: "2024-01-15",
    seller: "0x1234...5678",
    escrowState: "awaiting_confirmation",
  },
  {
    id: "2",
    productName: "Smart Security Camera",
    price: "0.8 AVAX",
    status: "confirmed",
    date: "2024-01-10",
    seller: "0x9876...5432",
    escrowState: "completed",
  },
]

const mockListedProducts = [
  {
    id: "1",
    name: "Luxury Leather Wallet",
    price: "0.3 AVAX",
    views: 45,
    status: "active",
    date: "2024-01-12",
  },
  {
    id: "2",
    name: "Vintage Watch Collection",
    price: "2.1 AVAX",
    views: 23,
    status: "sold",
    date: "2024-01-08",
  },
]

export function UserDashboard() {
  // const { user, balance } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "sold":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {user?.address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
              <p className="text-muted-foreground">{user?.address}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold text-foreground">{balance} AVAX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-xl font-bold text-foreground">{mockOrders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Listed</p>
                    <p className="text-xl font-bold text-foreground">{mockListedProducts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-xl font-bold text-foreground">4.8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Orders
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Orders</CardTitle>
                  <CardDescription>Your latest purchase activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{order.productName}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{order.price}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard?tab=orders">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Orders
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Seller Performance */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Seller Performance</CardTitle>
                  <CardDescription>Your selling statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-bold text-primary">2.4 AVAX</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Listings</span>
                    <span className="font-bold text-foreground">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-bold text-foreground">68</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Success Rate</span>
                    <span className="font-bold text-green-400">95%</span>
                  </div>
                  <Link href="/sell">
                    <Button className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      List New Product
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Order History</CardTitle>
                <CardDescription>Track all your purchases and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{order.productName}</h3>
                          <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">Seller: {order.seller}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-lg">{order.price}</p>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">Ordered on {order.date}</span>
                        <div className="flex gap-2">
                          {order.escrowState === "awaiting_confirmation" && (
                            <>
                              <Button size="sm" variant="outline">
                                Confirm Delivery
                              </Button>
                              <Button size="sm" variant="destructive">
                                Report Issue
                              </Button>
                            </>
                          )}
                          <Link href={`/product/${order.id}`}>
                            <Button size="sm" variant="ghost">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
                <p className="text-muted-foreground">Manage your products and sales</p>
              </div>
              <Link href="/sell">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockListedProducts.map((product) => (
                <Card key={product.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-bold text-primary">{product.price}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Views</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span className="text-foreground">{product.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Listed</span>
                        <span className="text-foreground">{product.date}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Wallet Address</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      <code className="text-sm text-muted-foreground">{user?.address}</code>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Notification Preferences</label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-border" />
                        <span className="text-sm text-foreground">Email notifications for orders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded border-border" />
                        <span className="text-sm text-foreground">Push notifications for messages</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm text-foreground">Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="destructive">Disconnect Wallet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
