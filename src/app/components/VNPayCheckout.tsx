'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VNPayCheckout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const orderId = `ORDER_${Date.now()}`;
    const amount = 1000000;
    const orderInfo = 'Payment for order';

    try {
      const response = await fetch('/api/vnpay/generate-payment-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay with VNPay'}
      </button>
    </div>
  );
};

export default VNPayCheckout;
