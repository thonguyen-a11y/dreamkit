"use client";

import Image from "next/image";
import { useStore } from "@/components/store/store-context";

export function HeroProducts() {
  const { products, isHydrated } = useStore();
  const heroProducts = products.slice(0, 3);

  if (!isHydrated || heroProducts.length === 0) {
    return null;
  }

  return (
    <ul className="ml-auto hidden items-center gap-3 md:flex">
      {heroProducts.map((product) => (
        <li
          key={product.id}
          className="relative size-16 overflow-hidden rounded-card border border-accent-foreground/20"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
