"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@prisma/client";
import { useCart } from "@/hooks/useCart";

interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showQuantity?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  showQuantity = false,
  className = "",
  disabled = false
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Check if the product is already in the cart
  const existingItem = items.find(item => item.id === product.id);
  const isInCart = !!existingItem;

  // Handle adding to cart
  const handleAddToCart = () => {
    if (disabled) return;
    
    setIsAdding(true);
    
    // Add to cart with animation
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
      
      toast.success("Đã thêm vào giỏ hàng", {
        description: `${product.name} (${quantity} sản phẩm)`
      });
      
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  return (
    <div className={`flex ${showQuantity ? 'items-center gap-3' : ''} ${className}`}>
      {showQuantity && (
        <div className="flex items-center border border-gray-300 rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || disabled}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
            disabled={quantity >= product.quantity || disabled}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <Button
        onClick={handleAddToCart}
        variant={variant}
        size={size}
        disabled={disabled || isAdding || (existingItem && existingItem.quantity >= product.quantity)}
        className={`${isAdding ? 'animate-pulse' : ''} ${className}`}
      >
        {isInCart ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Đã thêm
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm vào giỏ
          </>
        )}
      </Button>
    </div>
  );
}
