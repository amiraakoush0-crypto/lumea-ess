"use client"

import { createContext, useContext, useMemo, useReducer, useState, type ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  tagline: string
  quantity: number
}

type CartState = { items: CartItem[] }

type Action =
  | { type: "ADD"; payload: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "INCREMENT"; id: string }
  | { type: "DECREMENT"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.payload.id)
      const qty = action.quantity ?? 1
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + qty } : i,
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: qty }] }
    }
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      }
    case "DECREMENT":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0),
      }
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  subtotal: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0)
    return {
      items: state.items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item, quantity) => {
        dispatch({ type: "ADD", payload: item, quantity })
        setIsOpen(true)
      },
      increment: (id) => dispatch({ type: "INCREMENT", id }),
      decrement: (id) => dispatch({ type: "DECREMENT", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
      subtotal,
      count,
    }
  }, [state.items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
