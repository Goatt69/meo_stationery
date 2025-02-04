'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const VNPayCheckout = () => {
  const router = useRouter();

  useEffect(() => {
    const initiatePayment = async () => {
      const orderId = `ORDER_${Date.now()}`;
      const amount = 1000000; // Amount in VND
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
        } else {
          console.error('Payment URL not received');
        }
      } catch (error) {
        console.error('Error initiating payment:', error);
      }
    };

    initiatePayment();
  }, [router]);

  return <div>Redirecting to VNPay...</div>;
};

export default VNPayCheckout;
