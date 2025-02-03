import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStockStatus = (quantity: number) => {
  if (quantity === 0) return 'OUT_OF_STOCK'
  if (quantity < 20) return 'RUNNING_LOW'
  return 'IN_STOCK'
}

export  const formatToVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

