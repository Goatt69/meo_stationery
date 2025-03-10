
import { prisma } from '@/lib/prisma'
import ProductGrid from "@/components/products/ProductGrid";

export default async function Home() {

  const products = await prisma.product.findMany()
  
  return (
      <div className="pt-16">
        <h1 className="text-3xl font-bold mb-8">Sản phẩm</h1>
        <ProductGrid products={products}/>
      </div>
  )
}
