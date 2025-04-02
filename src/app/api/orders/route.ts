import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { cartItems, userDetails, paymentDetails } = await request.json();

  try {
    // First check if user exists
    let user = await prisma.user.findUnique({
      where: { email: userDetails.email }
    });

    if (!user) {
      // Create new user if doesn't exist
      const address = await prisma.address.create({
        data: {
          street: userDetails.street,
          ward: userDetails.ward,
          district: userDetails.district,
          city: userDetails.city,
          country: userDetails.country,
          apartment: userDetails.apartment,
        },
      });

      user = await prisma.user.create({
        data: {
          fullName: userDetails.fullName,
          email: userDetails.email,
          gender: userDetails.gender,
          dateOfBirth: userDetails.dateOfBirth,
          addressId: address.id,
        },
      });
    }

    // Create order with existing or new user
    const order = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          items: {
            createMany: {
              data: cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            },
          },
        },
      });

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: paymentDetails.amount,
          method: paymentDetails.method,
          status: paymentDetails.status,
          createdAt: new Date().toISOString(),
        },
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, data: { order, user } });

  } catch (error) {
    console.error("Order creation error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
        { success: false, error: "Failed to create order", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            address: true, // Include address information
          },
        },
        payment: {
          select: {
            amount: true,
          },
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
        { success: false, error: "Failed to fetch orders" },
        { status: 500 }
    );
  }
}