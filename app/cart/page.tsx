// app/cart/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Trash2, CheckCircle2, XCircle, Star, Truck } from "lucide-react"
import { useActiveAccount } from "thirdweb/react"
import {
  createOrderFromCart,
  getOrdersForUser,
  rateSeller,
  updateOrderState,
  type Order,
} from "@/lib/orders"

// --- Replace with your actual escrow contract call via thirdweb ---
// These are example stubs to mirror your Avalanche pattern.
async function onChainConfirmPayment(_order: Order) {
  // TODO: call prepareContractCall + useSendTransaction to confirm payment
  // return txHash if any
  return undefined
}
async function onChainCancelPurchase(_order: Order) {
  // TODO: call contract cancel method
  return undefined
}

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
  sellerAddress: string
}

export default function CartPage() {
  const account = useActiveAccount()
  const buyerAddress = account?.address ?? ""

  // Demo cart (swap to your app’s cart state/context if you have one)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // seed demo cart once (remove if you wire to your real cart)
  useEffect(() => {
    setCartItems(prev => prev.length ? prev : [
      {
        id: "1",
        productId: "p-1",
        name: "Wireless Headphones",
        price: 59.99,
        image: "/placeholder.svg",
        quantity: 1,
        stock: 5,
        sellerAddress: "0xsellerA",
      },
      {
        id: "2",
        productId: "p-2",
        name: "Gaming Mouse",
        price: 39.99,
        image: "/placeholder.svg",
        quantity: 2,
        stock: 10,
        sellerAddress: "0xsellerB",
      },
    ])
  }, [])

  const total = useMemo(
    () => cartItems.reduce((a, it) => a + it.price * it.quantity, 0),
    [cartItems]
  )

  // Load orders for this user
  useEffect(() => {
    setOrders(getOrdersForUser(buyerAddress))
  }, [buyerAddress])

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(it => {
      if (it.id !== id) return it
      const next = it.quantity + delta
      if (next < 1 || next > it.stock) return it
      return { ...it, quantity: next }
    }))
  }
  const removeItem = (id: string) => setCartItems(prev => prev.filter(it => it.id !== id))

  const checkout = () => {
    if (!buyerAddress) {
      alert("Connect a wallet to proceed to checkout.")
      return
    }
    if (cartItems.length === 0) return
    const order = createOrderFromCart(cartItems, buyerAddress)
    setCartItems([])
    setOrders(prev => [order, ...prev])
    // Optional: navigate to order details
    // router.push(`/orders/${order.id}`)
  }

  // Orders actions
  const handleConfirmPayment = async (order: Order) => {
    const txHash = await onChainConfirmPayment(order)
    const updated = updateOrderState(order.id, "delivered", txHash) // or "confirmed" depending on your flow
    if (updated) setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }
  const handleCancel = async (order: Order) => {
    const txHash = await onChainCancelPurchase(order)
    const updated = updateOrderState(order.id, "cancelled", txHash)
    if (updated) setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }
  const handleRate = (order: Order, rating: number) => {
    const updated = rateSeller(order.id, rating)
    if (updated) setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* CART */}
      <section>
        <h1 className="text-2xl font-bold text-white mb-4">Your Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <p className="text-gray-400">Your cart is empty.</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(item => (
                <Card key={item.id} className="bg-gray-900/50 border-gray-800 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={72} height={72} className="rounded-md" />
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-yellow-400">${item.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">{item.stock} in stock</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="icon" onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-white">{item.quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => updateQty(item.id, +1)} disabled={item.quantity >= item.stock}>
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-900/50 border-gray-800 p-4 mt-4 flex items-center justify-between">
              <div>
                <span className="text-gray-300 mr-2">Total:</span>
                <span className="text-yellow-400 font-semibold">${total.toFixed(2)}</span>
              </div>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={checkout}>
                Proceed to Checkout
              </Button>
            </Card>
          </>
        )}
      </section>

      {/* ORDERS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Orders</h2>
          <span className="text-sm text-gray-400">{orders.length} total</span>
        </div>

        {orders.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <p className="text-gray-400">No orders yet. Make a purchase to see it here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="bg-gray-900/50 border-gray-800 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-gray-400">
                    <div>Order #{order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleString()}</div>
                    <div className="mt-1">
                      <Badge variant="outline" className={
                        order.state === "confirmed" ? "border-green-500/30 text-green-400" :
                        order.state === "pending" ? "border-yellow-500/30 text-yellow-400" :
                        order.state === "delivered" ? "border-blue-500/30 text-blue-400" :
                        order.state === "disputed" ? "border-red-500/30 text-red-400" :
                        "border-gray-500/30 text-gray-400"
                      }>
                        {order.state}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-gray-300">Amount</div>
                    <div className="text-yellow-400 font-semibold">${order.amount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map(it => (
                    <div key={it.id} className="flex items-center gap-3">
                      <Image src={it.image} alt={it.name} width={56} height={56} className="rounded-md" />
                      <div className="text-sm">
                        <div className="text-white">{it.name}</div>
                        <div className="text-gray-400">
                          Qty: {it.quantity} • ${it.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="secondary" className="bg-gray-800 border-gray-700">View Details</Button>
                  </Link>

                  {/* Example actions – wire these to your escrow contract */}
                  {order.state === "pending" && (
                    <>
                      <Button onClick={() => handleConfirmPayment(order)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Payment
                      </Button>
                      <Button variant="destructive" onClick={() => handleCancel(order)}>
                        <XCircle className="h-4 w-4 mr-2" /> Cancel Purchase
                      </Button>
                    </>
                  )}

                  {order.state === "delivered" && (
                    <Button onClick={() => updateOrderState(order.id, "confirmed")}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Receipt
                    </Button>
                  )}

                  {/* Rating */}
                  <div className="ml-auto flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <Button
                        key={n}
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRate(order, n)}
                        title={`Rate ${n}`}
                        className={order.rating && order.rating >= n ? "text-yellow-400" : "text-gray-500"}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
