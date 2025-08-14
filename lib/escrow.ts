export type EscrowState =
  | "available" // Product available for purchase
  | "pending" // Payment sent, waiting for delivery
  | "delivered" // Seller marked as delivered, buyer can confirm/reject
  | "confirmed" // Buyer confirmed receipt, funds released
  | "disputed" // Buyer disputed, needs resolution
  | "cancelled" // Order cancelled/refunded

export interface EscrowOrder {
  id: string
  productId: string
  buyerAddress: string
  sellerAddress: string
  amount: string
  amountUSD: number
  state: EscrowState
  createdAt: Date
  deliveredAt?: Date
  confirmedAt?: Date
  disputedAt?: Date
  cancelledAt?: Date
  transactionHash?: string
  deliveryNotes?: string
  disputeReason?: string
}

export interface SellerReport {
  id: string
  reporterAddress: string
  sellerAddress: string
  productId: string
  reason: "fraud" | "fake_product" | "no_delivery" | "poor_quality" | "other"
  description: string
  createdAt: Date
  status: "pending" | "resolved" | "dismissed"
}

// Mock escrow orders for demonstration
export const mockEscrowOrders: Record<string, EscrowOrder[]> = {
  "1": [
    {
      id: "order_1",
      productId: "1",
      buyerAddress: "0x1234567890123456789012345678901234567890",
      sellerAddress: "0x9876543210987654321098765432109876543210",
      amount: "0.5 AVAX",
      amountUSD: 25.5,
      state: "confirmed",
      createdAt: new Date("2024-01-15"),
      deliveredAt: new Date("2024-01-18"),
      confirmedAt: new Date("2024-01-20"),
      transactionHash: "0xabc123...",
      deliveryNotes: "Package delivered successfully",
    },
  ],
  "2": [
    {
      id: "order_2",
      productId: "2",
      buyerAddress: "0x5555555555555555555555555555555555555555",
      sellerAddress: "0x7777777777777777777777777777777777777777",
      amount: "0.2 AVAX",
      amountUSD: 10.2,
      state: "delivered",
      createdAt: new Date("2024-02-01"),
      deliveredAt: new Date("2024-02-05"),
      transactionHash: "0xdef456...",
      deliveryNotes: "Left at front door as requested",
    },
  ],
}

export const mockReports: SellerReport[] = []

export async function createEscrowOrder(
  productId: string,
  buyerAddress: string,
  sellerAddress: string,
  amount: string,
  amountUSD: number,
): Promise<EscrowOrder> {
  // In a real implementation, this would interact with the smart contract
  const order: EscrowOrder = {
    id: `order_${Date.now()}`,
    productId,
    buyerAddress,
    sellerAddress,
    amount,
    amountUSD,
    state: "pending",
    createdAt: new Date(),
    transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
  }

  if (!mockEscrowOrders[productId]) {
    mockEscrowOrders[productId] = []
  }
  mockEscrowOrders[productId].push(order)

  return order
}

export async function confirmDelivery(orderId: string): Promise<void> {
  // Find and update order state
  for (const orders of Object.values(mockEscrowOrders)) {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      order.state = "confirmed"
      order.confirmedAt = new Date()
      break
    }
  }
}

export async function disputeOrder(orderId: string, reason: string): Promise<void> {
  // Find and update order state
  for (const orders of Object.values(mockEscrowOrders)) {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      order.state = "disputed"
      order.disputedAt = new Date()
      order.disputeReason = reason
      break
    }
  }
}

export async function reportSeller(
  reporterAddress: string,
  sellerAddress: string,
  productId: string,
  reason: SellerReport["reason"],
  description: string,
): Promise<void> {
  const report: SellerReport = {
    id: `report_${Date.now()}`,
    reporterAddress,
    sellerAddress,
    productId,
    reason,
    description,
    createdAt: new Date(),
    status: "pending",
  }

  mockReports.push(report)
}

export function getOrdersForProduct(productId: string): EscrowOrder[] {
  return mockEscrowOrders[productId] || []
}

export function getUserOrders(userAddress: string): EscrowOrder[] {
  const allOrders: EscrowOrder[] = []
  for (const orders of Object.values(mockEscrowOrders)) {
    allOrders.push(...orders.filter((o) => o.buyerAddress === userAddress || o.sellerAddress === userAddress))
  }
  return allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
