// pages/vnpay-return.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const VNPayReturn = () => {
  const router = useRouter();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/vnpay/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(router.query),
        });

        const data = await response.json();
        if (data.success) {
          // Handle successful payment
        } else {
          // Handle failed payment
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    };

    if (router.query.vnp_TxnRef) {
      verifyPayment();
    }
  }, [router.query]);

  return <div>Processing payment...</div>;
};

export default VNPayReturn;
