import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { AvaxProvider } from "@/contexts/AvaxProvider"
import { ThirdwebProvider } from "thirdweb/react"

export const metadata: Metadata = {
  title: "PeerMart - Decentralized Commerce",
  description: "Secure blockchain-powered marketplace on Avalanche",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* <AvaxProvider> */}
        <ThirdwebProvider>
          <Navbar />
          {children}
        </ThirdwebProvider>
        {/* </AvaxProvider> */}
      </body>
    </html>
  )
}
