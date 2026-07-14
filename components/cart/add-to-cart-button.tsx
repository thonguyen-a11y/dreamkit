"use client";

import { useEffect, useRef, useState } from "react";
import { COLOR_META } from "@/lib/products";
import { PRODUCT_SIZES, type ProductSize } from "@/lib/product-sizes";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useCart } from "./cart-context";

interface AddToCartButtonProps {
  readonly product: Product;
}

const DEFAULT_SIZE: ProductSize = "M";

/**
 * Lets a shopper pick a colour/size variant and add it to the cart. Isolated
 * as its own client component so only this control (not the whole memoised
 * product card) subscribes to cart context.
 */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.primaryColor);
  const [size, setSize] = useState<ProductSize>(DEFAULT_SIZE);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleAdd() {
    addItem(product.id, color, size);
    setJustAdded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-2">
      {product.colors.length > 1 ? (
        <ul className="flex items-center justify-center gap-1.5">
          {product.colors.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => setColor(option)}
                aria-label={COLOR_META[option].label}
                aria-pressed={color === option}
                className={cn(
                  "size-4 rounded-full border transition-transform",
                  color === option
                    ? "scale-110 border-foreground ring-1 ring-foreground ring-offset-1 ring-offset-background"
                    : "border-border",
                )}
                style={{ backgroundColor: COLOR_META[option].hex }}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-1.5">
        <select
          value={size}
          onChange={(event) => setSize(event.target.value as ProductSize)}
          aria-label="Kích cỡ"
          className="h-8 shrink-0 rounded-card border border-border bg-background px-1.5 text-xs text-foreground"
        >
          {PRODUCT_SIZES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-card bg-accent px-2 text-[0.65rem] font-medium uppercase tracking-label text-accent-foreground transition-colors hover:bg-foreground/85"
        >
          {justAdded ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}
