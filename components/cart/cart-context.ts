"use client";

import { createContext, useContext } from "react";
import type { CartDetailLine } from "@/lib/cart";

export interface CartContextValue {
  readonly items: readonly CartDetailLine[];
  readonly subtotal: number;
  readonly count: number;
  readonly addItem: (id: string, quantity?: number) => void;
  readonly removeItem: (id: string) => void;
  readonly setQuantity: (id: string, quantity: number) => void;
  readonly clear: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** Access the cart. Must be used within `CartProvider`. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
