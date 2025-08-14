import { Hero } from "@/components/hero"
import { CompanyInfo } from "@/components/company-info"
import { ProductPreview } from "@/components/product-preview"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-premium-gradient">
      <Hero />
      <CompanyInfo />
      <ProductPreview />
      <Footer />
    </div>
  )
}
