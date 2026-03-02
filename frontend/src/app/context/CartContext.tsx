"use client"
import { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: string
  title: string
  image: string
  capacity: string
  price: number
  qty: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string, capacity: string) => void
  updateQty: (id: string, capacity: string, qty: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("CartProvider missing")
  return ctx
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  /* ---------- Load from localStorage ---------- */
  useEffect(() => {
    const stored = localStorage.getItem("metrocart")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  /* ---------- Save to localStorage ---------- */
  useEffect(() => {
    localStorage.setItem("metrocart", JSON.stringify(cart))
  }, [cart])

const addToCart = (item: CartItem) => {
  setCart(prev => {
    const existIndex = prev.findIndex(
      p => p.id === item.id && p.capacity === item.capacity
    );

    if (existIndex !== -1) {
      const updated = [...prev];
      updated[existIndex].qty += 1;
      return updated;
    }

    return [...prev, item];
  });
};

  const removeFromCart = (id: string, capacity: string) => {
    setCart(prev => prev.filter(p => !(p.id === id && p.capacity === capacity)))
  }

  const updateQty = (id: string, capacity: string, qty: number) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id && p.capacity === capacity ? { ...p, qty } : p
      )
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((a, b) => a + b.price * b.qty, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}