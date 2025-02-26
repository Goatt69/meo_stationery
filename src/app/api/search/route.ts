import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json([])
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true
    },
    take: 5
  })

  return NextResponse.json(products)
}