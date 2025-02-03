import { useState, useEffect } from 'react'

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  const addItem = (product: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id)
      let newItems
      
      if (existingItem) {
        newItems = currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...currentItems, { ...product, quantity: 1 }]
      }
      
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newItems
    })
  }

  const removeItem = (id: number) => {
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newItems
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    setItems(currentItems => {
      const newItems = currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newItems
    })
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
  }
}
