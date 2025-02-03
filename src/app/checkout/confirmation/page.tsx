import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-5">Order Confirmed!</h1>
      <p className="mb-5">Thank you for your purchase. Your order has been successfully placed.</p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  )
}

