"use client"

import { useSearchParams } from "next/navigation"
import { CheckoutCard } from "@/components/CheckoutCard"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get("method") || "visa"

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Payment</h1>
      {paymentMethod === "momo" ? (
        <div>
          <p>Please complete your payment using MoMo.</p>
          {/* Add MoMo payment integration here */}
        </div>
      ) : (
        <CheckoutCard />
      )}
    </div>
  )
}

