"use client";

import { useEffect, useState } from "react";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [loading, setLoading] = useState(false);

  // Use `window.location.search` instead of `useSearchParams`
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const method = params.get("method") || "visa";
    setPaymentMethod(method);
  }, []);

  useEffect(() => {
    if (paymentMethod === "VNPAY") {
      handleVNPayPayment();
    }
  }, [paymentMethod]);

  const handleVNPayPayment = async () => {
    setLoading(true);
    const orderId = `ORDER_${Date.now()}`;
    const amount = 1000000;
    const orderInfo = "Payment for order";

    try {
      const response = await fetch("/api/vnpay/generate-payment-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount, orderInfo }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.paymentUrl) {
        console.log("Redirecting to payment URL:", data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        console.error("Payment URL not received");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Payment</h1>
      {paymentMethod === "VNPAY" ? (
        <div className="text-center">
          {loading ? <p>Redirecting to VNPay...</p> : <p>Please wait while we redirect you to VNPay.</p>}
        </div>
      ) : (
        <p>Selected payment method: {paymentMethod}</p>
      )}
    </div>
  );
};

export default PaymentPage;
