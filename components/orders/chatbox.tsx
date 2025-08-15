"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getChat, sendMessage, type ChatMsg } from "@/lib/orderChat"

export function ChatBox({ orderId, role }: { orderId: string; role: "buyer" | "seller" }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMsgs(getChat(orderId))
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs])

  const onSend = () => {
    if (!text.trim()) return
    const next = sendMessage(orderId, role, text.trim())
    setMsgs(next)
    setText("")
  }

  return (
    <div className="space-y-3">
      <Card className="bg-gray-950/50 border-gray-800 p-3 h-64 overflow-y-auto">
        {msgs.length === 0 ? (
          <p className="text-gray-500 text-sm">No messages yet.</p>
        ) : (
          msgs.map(m => (
            <div key={m.id} className={`mb-2 flex ${m.from === role ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] text-sm px-3 py-2 rounded-xl
                ${m.from === role ? "bg-yellow-500/20 text-yellow-100" : "bg-gray-800 text-gray-100"}`}>
                <div className="text-[10px] opacity-70 mb-1">{m.from}</div>
                <div>{m.text}</div>
                <div className="text-[10px] opacity-50 mt-1">{new Date(m.ts).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </Card>

      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="bg-gray-900 border-gray-800 text-white"
          onKeyDown={(e) => { if (e.key === "Enter") onSend() }}
        />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  )
}
