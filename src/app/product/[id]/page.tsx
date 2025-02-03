import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { prisma } from '@/lib/prisma'
import {formatToVND} from "@/lib/utils";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id)
    },
    include: {
      category: true
    }
  })

  if (!product) {
    notFound()
  }

  return (
      <>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category?.catName.toLowerCase()}`}>{product.category?.catName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
                src={"/placeholder.svg"}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{formatToVND(product.price)}</p>
            <p className="text-gray-700 mb-6">{product.status}</p>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Stock Status:</span>
                <span className={`${product.stock === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock}
              </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Available Quantity:</span>
                <span>{product.quantity}</span>
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-semibold">Order Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    max={product.quantity}
                    defaultValue="1"
                    className="border rounded px-2 py-1 w-16"
                />
              </div>
            </div>
            <Button size="lg" disabled={product.stock === 'OUT_OF_STOCK'}>
              {product.stock === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </>
  )
}
