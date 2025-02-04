
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentReturn() {
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');

    if (vnp_ResponseCode === '00') {
      alert('Payment successful!');
      router.push('/success'); // Redirect to success page
    } else {
      alert('Payment failed!');
      router.push('/failure'); // Redirect to failure page
    }
  }, [router]);

  return <div>Processing payment...</div>;
}