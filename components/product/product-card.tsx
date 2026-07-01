import { memo } from "react";
import Image from "next/image";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatPrice } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ColorSwatches } from "./color-swatches";

interface ProductCardProps {
  product: Product;
  /** First card in the viewport can opt into priority loading. */
  priority?: boolean;
}

function ProductCardImpl({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-card border border-border bg-surface">
        {product.isNew ? (
          <span className="absolute left-4 top-4 z-10 bg-accent px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-label text-accent-foreground">
            Mới
          </span>
        ) : null}

        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 translate-y-full p-4 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <AddToCartButton productId={product.id} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <span className="text-[0.7rem] font-medium uppercase tracking-label text-highlight">
          {product.category}
        </span>
        <h3 className="text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          <ColorSwatches colors={product.colors} />
        </div>
      </div>
    </article>
  );
}

/** Memoised so re-filtering only re-renders cards whose props changed. */
export const ProductCard = memo(ProductCardImpl);
