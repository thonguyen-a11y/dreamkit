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
import type { ProductSize } from "@/lib/product-sizes";
import type { ColorKey } from "@/lib/types";
import { useStore } from "@/components/store/store-context";
import { CartContext, type CartContextValue } from "./cart-context";

const STORAGE_KEY = "dreamkit-cart";

/**
 * Holds cart state, derives display totals from the catalogue, and persists to
 * localStorage. Persistence only starts after the initial read so an empty
 * first render never clobbers a stored cart (and SSR stays safe).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useStore();
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

  const addItem = useCallback(
    (id: string, color: ColorKey, size: ProductSize, quantity = 1) => {
      setLines((current) => addLine(current, id, color, size, quantity));
    },
    [],
  );
  const removeItem = useCallback((id: string, color: ColorKey, size: ProductSize) => {
    setLines((current) => removeLine(current, id, color, size));
  }, []);
  const setQuantity = useCallback(
    (id: string, color: ColorKey, size: ProductSize, quantity: number) => {
      setLines((current) => setLineQuantity(current, id, color, size, quantity));
    },
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const { items, subtotal, count } = summarizeCart(lines, products);
    return { items, subtotal, count, addItem, removeItem, setQuantity, clear };
  }, [lines, products, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
