"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ShippingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("visa")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the shipping info and payment method
    console.log("Shipping info:", formData)
    console.log("Payment method:", paymentMethod)
    if (paymentMethod === "cod") {
      // For COD, we can skip the payment page
      router.push("/checkout/confirmation")
    } else if (paymentMethod === "VNPAY") {
      router.push("/checkout/payment/vnpay") // Redirect to VNPay payment
    } else {
      router.push("/checkout/payment") // Redirect to other payment methods
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Shipping Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <RadioGroup defaultValue="visa" onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visa" id="visa" />
              <Label htmlFor="visa">Visa</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo">MoMo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="VNPAY" id="VNPAY" />
              <Label htmlFor="VNPAY">VNPAY</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit">Proceed to Payment</Button>
      </form>
    </div>
  )
}

