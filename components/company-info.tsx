import { Card } from "@/components/ui/card"
import { Shield, Users, Zap, Globe } from "lucide-react"

export function CompanyInfo() {
  const features = [
    {
      icon: Shield,
      title: "Escrow Protection",
      description:
        "Smart contracts hold funds until delivery is confirmed, ensuring secure transactions for all parties.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by the community, for the community. Everyone can be a seller until proven otherwise.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Powered by Avalanche network for instant transactions and minimal fees.",
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect with buyers and sellers worldwide in a truly decentralized ecosystem.",
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're revolutionizing e-commerce with blockchain technology, creating a safer and more transparent
            marketplace for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-900/50 border-gray-800 p-6 hover:bg-gray-900/70 transition-colors group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
