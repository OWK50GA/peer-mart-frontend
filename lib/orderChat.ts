// lib/orderChat.ts
export interface ChatMsg {
  id: string
  from: "buyer" | "seller"
  text: string
  ts: string
}
const KEY = (orderId: string) => `orderchat:v1:${orderId}`

export function getChat(orderId: string): ChatMsg[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(KEY(orderId)) || "[]") as ChatMsg[]
  } catch {
    return []
  }
}

export function sendMessage(orderId: string, from: ChatMsg["from"], text: string) {
  const msgs = getChat(orderId)
  msgs.push({ id: crypto.randomUUID(), from, text, ts: new Date().toISOString() })
  localStorage.setItem(KEY(orderId), JSON.stringify(msgs))
  return msgs
}
