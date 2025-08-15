import { ProductDetailsPage } from "@/components/product/product-details-page"
import { getProductById } from "@/lib/products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function Product({ params }: ProductPageProps) {
  const { productId } = await params;
  

  return (
      <ProductDetailsPage productId={parseInt(productId)} />
  )
}

// export async function generateMetadata({ params }: ProductPageProps) {
//   const { productId } = await params

//   if (!product) {
//     return {
//       title: "Product Not Found",
//     }
//   }

//   return {
//     title: `${product.name} - PeerMart`,
//     description: product.description,
//   }
// }
