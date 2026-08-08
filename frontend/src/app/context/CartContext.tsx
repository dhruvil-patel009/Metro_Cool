"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"

export interface CartItem {
  id: string
  title: string
  image: string
  capacity: string
  price: number
  qty: number
  delivery_charge?: number
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

/** Returns a user-scoped localStorage key so carts never bleed across accounts */
function cartKey(userId: string | undefined) {
  return userId ? `metrocart_${userId}` : null
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const userId = useAuthStore((s) => s.user?.id)

  /* ---------- Load from localStorage when user changes ---------- */
  useEffect(() => {
    const key = cartKey(userId)

    if (!key) {
      // No logged-in user — show empty cart
      setCart([])
      return
    }

    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed: CartItem[] = JSON.parse(stored)
        // Strip stale delivery_charge: 0 so the product page re-applies the correct value on next addToCart
        const cleaned = parsed.map(item => ({
          ...item,
          delivery_charge: item.delivery_charge === 0 ? undefined : item.delivery_charge,
        }))
        setCart(cleaned)
      } catch {
        setCart([])
      }
    } else {
      // New user with no saved cart — start fresh
      setCart([])
    }
  }, [userId])

  /* ---------- Save to localStorage (only when a user is logged in) ---------- */
  useEffect(() => {
    const key = cartKey(userId)
    if (!key) return
    localStorage.setItem(key, JSON.stringify(cart))
  }, [cart, userId])

const addToCart = (item: CartItem) => {
  setCart(prev => {
    const existIndex = prev.findIndex(
      p => p.id === item.id && p.capacity === item.capacity
    );

    if (existIndex !== -1) {
      const updated = [...prev];
      updated[existIndex] = {
        ...updated[existIndex],
        qty: updated[existIndex].qty + 1,
        price: item.price,                        // refresh price from latest product data
        delivery_charge: item.delivery_charge,    // refresh delivery charge from latest product data
      };
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