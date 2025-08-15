// lib/orders.ts
export type EscrowState = "pending" | "delivered" | "confirmed" | "disputed" | "cancelled"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
  sellerAddress: string
}

export interface Order {
  id: string
  buyerAddress: string
  items: OrderItem[]
  amount: number
  state: EscrowState
  createdAt: string
  transactionHash?: string
  rating?: number
  location: {
    status: "processing" | "in_transit" | "out_for_delivery" | "delivered"
    lastUpdated: string
  }
}

const KEY = "orders:v1"

function loadAll(): Order[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Order[]
  } catch {
    return []
  }
}
function saveAll(orders: Order[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(orders))
}

export function getOrdersForUser(buyerAddress?: string | null) {
  const all = loadAll()
  if (!buyerAddress) return []
  return all.filter(o => o.buyerAddress.toLowerCase() === buyerAddress.toLowerCase())
}

export function createOrderFromCart(
  items: Omit<OrderItem, "id">[] & { id?: string }[],
  buyerAddress: string
) {
  const id = crypto.randomUUID()
  const normalized: OrderItem[] = items.map(it => ({
    id: crypto.randomUUID(),
    productId: it.productId,
    name: it.name,
    price: it.price,
    image: it.image,
    quantity: it.quantity,
    stock: it.stock,
    sellerAddress: it.sellerAddress,
  }))
  const amount = normalized.reduce((a, it) => a + it.price * it.quantity, 0)
  const order: Order = {
    id,
    buyerAddress,
    items: normalized,
    amount,
    state: "pending",
    createdAt: new Date().toISOString(),
    location: { status: "processing", lastUpdated: new Date().toISOString() },
  }
  const all = loadAll()
  all.unshift(order)
  saveAll(all)
  return order
}

export function updateOrderState(id: string, state: EscrowState, txHash?: string) {
  const all = loadAll()
  const idx = all.findIndex(o => o.id === id)
  if (idx >= 0) {
    all[idx].state = state
    if (txHash) all[idx].transactionHash = txHash
    saveAll(all)
    return all[idx]
  }
  return null
}

export function rateSeller(id: string, rating: number) {
  const all = loadAll()
  const idx = all.findIndex(o => o.id === id)
  if (idx >= 0) {
    all[idx].rating = rating
    saveAll(all)
    return all[idx]
  }
  return null
}

export function updateLocation(id: string, status: Order["location"]["status"]) {
  const all = loadAll()
  const idx = all.findIndex(o => o.id === id)
  if (idx >= 0) {
    all[idx].location = { status, lastUpdated: new Date().toISOString() }
    saveAll(all)
    return all[idx]
  }
  return null
}

export function getOrderById(id: string) {
  return loadAll().find(o => o.id === id) || null
}
