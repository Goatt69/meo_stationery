import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { prisma } from '@/lib/prisma'
import { Skeleton } from "@/components/ui/skeleton"
import {use} from "react";

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
async function getCategoryData(category: string) {
  return await prisma.category.findFirst({
    where: {
      catName: {
        equals: category,
        mode: 'insensitive'
      }
    },
    include: {
      children: {
        include: {
          products: true
        }
      },
      products: true
    }
  })
}

type Params = Promise<{ category: string }>

const CategoryPage = (props: { params: Params }) => {
    const params = use(props.params)
    const decodedCategory = decodeURIComponent(params.category)
    const category = use(getCategoryData(decodedCategory))

    if (!category) {
        notFound()
    }

  return (
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>{category.catName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-8">{category.catName}</h1>

        {category.children.map((subcategory) => (
            <div key={subcategory.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{subcategory.catName}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.products.length > 0 ? (
                    subcategory.products.map((product) => (
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
                            <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
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
                            >
                              {product.stock === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                          </CardFooter>
                        </Card>
                    ))
                ) : (
                    <>
                      <SkeletonCard/>
                      <SkeletonCard/>
                      <SkeletonCard/>
                      <SkeletonCard/>
                    </>
                )}
              </div>
            </div>
        ))}

        {/* Display products directly under this category if any */}
        {category.products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">All Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.products.map((product) => (
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
                        <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
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
                        >
                          {product.stock === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardFooter>
                    </Card>
                ))}
              </div>
            </div>
        )}
      </div>
  )
}
export default CategoryPage