"use client"

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Truck, PackageCheck, MessagesSquare } from "lucide-react";
import { getOrderById, updateLocation, type Order } from "@/lib/orders";
import { ChatBox } from "@/components/orders/chatbox";

const stepOrder = ["processing", "in_transit", "out_for_delivery", "delivered"] as const
type Step = typeof stepOrder[number]

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) setOrder(getOrderById(orderId))
  }, [orderId])

  const currentStepIndex = useMemo(() => {
    if (!order) return 0
    return stepOrder.indexOf(order.location.status)
  }, [order])

  const advanceLocation = () => {
    if (!order) return
    const nextIdx = Math.min(currentStepIndex + 1, stepOrder.length - 1)
    const updated = updateLocation(order.id, stepOrder[nextIdx])
    if (updated) setOrder(updated)
  }

  if (!order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/cart" className="text-gray-400 hover:text-yellow-400 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Link>
        <Card className="bg-gray-900/50 border-gray-800 p-6 mt-4">
          <p className="text-gray-400">Order not found.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/cart" className="text-gray-400 hover:text-yellow-400 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Cart & Orders
        </Link>
        <div className="text-sm text-gray-400">
          Order #{order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold">Order Summary</div>
            <div className="text-gray-400 text-sm">Amount: <span className="text-yellow-400 font-semibold">${order.amount.toFixed(2)}</span></div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {order.items.map(it => (
              <div key={it.id} className="flex items-center gap-3">
                <Image src={it.image} alt={it.name} width={56} height={56} className="rounded-md" />
                <div className="text-sm">
                  <div className="text-white">{it.name}</div>
                  <div className="text-gray-400">Qty: {it.quantity} • ${it.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Location Tracking */}
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-yellow-400" />
          <div className="text-white font-semibold">Location Tracking</div>
        </div>

        <div className="flex items-center justify-between">
          {stepOrder.map((step, idx) => (
            <div key={step} className="flex-1 flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border
                ${idx <= currentStepIndex ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "border-gray-700 text-gray-500"}`}>
                {idx < 2 ? <Truck className="h-4 w-4" /> : <PackageCheck className="h-4 w-4" />}
              </div>
              {idx < stepOrder.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${idx < currentStepIndex ? "bg-yellow-500" : "bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 text-sm text-gray-400">
          Status: <span className="text-white">{order.location.status.replaceAll("_", " ")}</span> • Updated{" "}
          {new Date(order.location.lastUpdated).toLocaleString()}
        </div>

        {/* For demo only: advance status */}
        <Button className="mt-4" variant="secondary" onClick={advanceLocation} disabled={order.location.status === "delivered"}>
          Advance Status
        </Button>
      </Card>

      {/* Tiny Chat */}
      <Card className="bg-gray-900/50 border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessagesSquare className="h-5 w-5 text-yellow-400" />
          <div className="text-white font-semibold">Buyer–Seller Chat</div>
        </div>
        <ChatBox orderId={order.id} role="buyer" />
      </Card>
    </div>
  )
}
