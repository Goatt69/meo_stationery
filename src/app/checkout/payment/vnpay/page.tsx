"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VNPayReturnPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing payment...");

  useEffect(() => {
    console.log("Raw search params:", searchParams.toString());

    const responseCode = searchParams.get("vnp_ResponseCode");
    console.log("VNPay Response Code:", responseCode); // Debugging log

    if (responseCode === "00") {
      setStatus("Payment successful! Thank you.");
    } else {
      setStatus("Payment failed. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold">{status}</h1>
    </div>
  );
}
