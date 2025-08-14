import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400 ring-1 ring-yellow-500/20">
            <Zap className="mr-2 h-4 w-4" />
            Powered by Avalanche Blockchain
          </span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl">
          The Future of
          <span className="bg-gold-gradient bg-clip-text font-bold"> Secure </span>
          Commerce
        </h1>

        <p className="mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
          Experience decentralized marketplace with built-in escrow protection. Buy and sell with confidence on the
          Avalanche network.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" className="bg-gold-gradient text-black font-semibold hover:opacity-90 transition-opacity">
            Explore Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
          >
            <Shield className="mr-2 h-5 w-5" />
            Learn About Security
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">100%</div>
            <div className="text-sm text-gray-400">Secure Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">24/7</div>
            <div className="text-sm text-gray-400">Blockchain Protection</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">0%</div>
            <div className="text-sm text-gray-400">Platform Fees</div>
          </div>
        </div>
      </div>
    </section>
  )
}
