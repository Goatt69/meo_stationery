import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const data = await request.json();
  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: parseInt(data.price),
      quantity: parseInt(data.stock),
      status: data.description,
      createdAt: new Date().toISOString(),
      categoryId: data.categoryId,
    },
  });
  return NextResponse.json(product);
}
