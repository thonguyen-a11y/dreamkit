"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColorKey, Product } from "@/lib/types";

export interface UseProductFilterResult {
  /** Currently active colour filters (empty set = show everything). */
  readonly activeColors: ReadonlySet<ColorKey>;
  /** Products matching the active filters. */
  readonly filteredProducts: readonly Product[];
  /** Toggle a colour on/off. */
  readonly toggleColor: (color: ColorKey) => void;
  /** Reset all filters. */
  readonly clearFilters: () => void;
  readonly isFiltering: boolean;
}

/**
 * Encapsulates colour-filtering state for a product list.
 *
 * Kept as a hook (rather than inline state) so the filtering behaviour is
 * unit-testable in isolation and the consuming components stay presentational.
 * A product matches when it offers at least one of the selected colours (OR
 * semantics), mirroring how the original storefront's colour facets behave.
 */
export function useProductFilter(
  products: readonly Product[],
): UseProductFilterResult {
  const [activeColors, setActiveColors] = useState<ReadonlySet<ColorKey>>(
    () => new Set(),
  );

  const toggleColor = useCallback((color: ColorKey) => {
    setActiveColors((current) => {
      const next = new Set(current);
      if (next.has(color)) {
        next.delete(color);
      } else {
        next.add(color);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveColors((current) => (current.size === 0 ? current : new Set()));
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeColors.size === 0) {
      return products;
    }
    return products.filter((product) =>
      product.colors.some((color) => activeColors.has(color)),
    );
  }, [products, activeColors]);

  return {
    activeColors,
    filteredProducts,
    toggleColor,
    clearFilters,
    isFiltering: activeColors.size > 0,
  };
}
