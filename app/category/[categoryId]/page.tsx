import { CategoryPage } from "@/components/category/category-page"
import { categories } from "@/lib/products"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{
    categoryId: string
  }>
}

export default async function Category({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound()
  }

  return (
      <CategoryPage category={category} />
  )
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.id,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = categories.find((c) => c.id === categoryId)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - PeerMart`,
    description: category.description,
  }
}
