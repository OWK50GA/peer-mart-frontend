import { ProductDetailsPage } from "@/components/product/product-details-page"
import { getProductById } from "@/lib/products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    productId: string
  }
}

export default function Product({ params }: ProductPageProps) {
  const product = getProductById(params.productId)

  if (!product) {
    notFound()
  }

  return (
      <ProductDetailsPage product={product} />
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = getProductById(params.productId)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - PeerMart`,
    description: product.description,
  }
}
