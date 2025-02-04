"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VNPayCheckout = () => {
  const router = useRouter();

  useEffect(() => {
    const generatePaymentUrl = async () => {
      const orderId = `ORDER_${Date.now()}`;
      const amount = 1000000; // Example amount in VND
      const orderInfo = 'Payment for order';

      try {
        const response = await fetch('/api/vnpay/generate-payment-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, amount, orderInfo }),
        });

        const data = await response.json();
        if (data.paymentUrl) {
          router.push(data.paymentUrl);
        }
      } catch (error) {
        console.error('Error generating payment URL:', error);
      }
    };

    generatePaymentUrl();
  }, [router]);

  return <div>Redirecting to VNPAY...</div>;
};

export default VNPayCheckout;