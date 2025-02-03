'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from "@/hooks/useCart"
import { Skeleton } from "@/components/ui/skeleton"
import {formatToVND} from "@/lib/utils";

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export default function ProductGrid({ categories }) {
  const { addItem } = useCart()

  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category.catName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.length > 0 ? (
              category.products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <img
                        src="/placeholder.svg"
                        alt={product.name}
                        className="w-full h-48 object-cover mb-4"
                      />
                    </Link>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600">{formatToVND(product.price)}</p>
                    <div className="mt-2">
                      <span className={`text-sm ${product.stock === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={product.stock === 'OUT_OF_STOCK'}
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        stock: product.quantity
                      })}
                    >
                      {product.stock === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
          </div>
        </div>
      ))}
    </>
  )
}
