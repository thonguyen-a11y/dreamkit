"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addLine,
  parseCartLines,
  removeLine,
  setLineQuantity,
  summarizeCart,
  type CartLine,
} from "@/lib/cart";
import { PRODUCTS } from "@/lib/products";
import { CartContext, type CartContextValue } from "./cart-context";

const STORAGE_KEY = "dreamkit-cart";

/**
 * Holds cart state, derives display totals from the catalogue, and persists to
 * localStorage. Persistence only starts after the initial read so an empty
 * first render never clobbers a stored cart (and SSR stays safe).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<readonly CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLines(parseCartLines(JSON.parse(stored)));
      }
    } catch {
      // Corrupt/unavailable storage: start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Ignore quota/availability errors — the cart still works in-memory.
    }
  }, [lines, isHydrated]);

  const addItem = useCallback((id: string, quantity = 1) => {
    setLines((current) => addLine(current, id, quantity));
  }, []);
  const removeItem = useCallback((id: string) => {
    setLines((current) => removeLine(current, id));
  }, []);
  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) => setLineQuantity(current, id, quantity));
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const { items, subtotal, count } = summarizeCart(lines, PRODUCTS);
    return { items, subtotal, count, addItem, removeItem, setQuantity, clear };
  }, [lines, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
