// app/payment/page.tsx
"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckoutCard } from "@/components/CheckoutCard"
import VNPayCheckout from '@/app/components/VNPayCheckout';

function PaymentContent() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get('method') || 'visa';

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Payment</h1>
      {paymentMethod === 'VNPAY' ? (
        <VNPayCheckout />
      ) : paymentMethod === 'momo' ? (
        <div>
          <p>Please complete your payment using MoMo.</p>
          {/* Add MoMo payment integration here */}
        </div>
      ) : (
        <CheckoutCard />
      )}
    </div>
  );
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
