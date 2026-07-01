"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";

interface AddToCartButtonProps {
  productId: string;
}

/**
 * Adds a product to the cart and briefly confirms. Isolated as its own client
 * component so only the button (not the whole memoised product card) subscribes
 * to cart context.
 */
export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleClick() {
    addItem(productId);
    setJustAdded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-card bg-accent py-3 text-xs font-medium uppercase tracking-label text-accent-foreground transition-colors hover:bg-foreground/85"
    >
      {justAdded ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
    </button>
  );
}
