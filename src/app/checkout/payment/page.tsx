"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckoutCard } from "@/components/CheckoutCard"

function PaymentContent() {
  const searchParams = useSearchParams()
  const paymentMethod = searchParams.get("method") || "visa"

  return (
      <>
        <h1 className="text-3xl font-bold mb-5">Payment</h1>
        {paymentMethod === "momo" ? (
            <div>
              <p>Please complete your payment using MoMo.</p>
              {/* Add MoMo payment integration here */}
            </div>
        ) : (
            <CheckoutCard />
        )}
      </>
  )
}

export default function PaymentPage() {
  return (
      <div className="container mx-auto py-10">
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentContent />
        </Suspense>
      </div>
  )
}
