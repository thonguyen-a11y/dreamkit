"use client";

import { useCallback, useMemo, useState } from "react";
import {
  PAGE_SIZE,
  filterProducts,
  pageCount,
  paginate,
  sortProducts,
  type SortKey,
} from "@/lib/catalog";
import type {
  CollarType,
  ColorKey,
  Product,
  ProductType,
} from "@/lib/types";

type FacetValue = ColorKey | CollarType | ProductType;

export interface UseCatalogResult {
  readonly pageItems: readonly Product[];
  readonly totalCount: number;
  readonly totalPages: number;
  readonly page: number;
  readonly pageSize: number;
  readonly rangeStart: number;
  readonly rangeEnd: number;
  readonly sort: SortKey;
  readonly activeColors: ReadonlySet<ColorKey>;
  readonly activeCollars: ReadonlySet<CollarType>;
  readonly activeTypes: ReadonlySet<ProductType>;
  readonly hasActiveFilters: boolean;
  readonly setSort: (sort: SortKey) => void;
  readonly setPage: (page: number) => void;
  readonly setPageSize: (pageSize: number) => void;
  readonly toggleColor: (color: ColorKey) => void;
  readonly toggleCollar: (collar: CollarType) => void;
  readonly toggleType: (type: ProductType) => void;
  readonly clearFilters: () => void;
}

function toggleInSet<T extends FacetValue>(
  set: ReadonlySet<T>,
  value: T,
): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

/**
 * Orchestrates the shop catalogue: faceted filtering, sorting and pagination.
 *
 * All derivations are memoised, and any filter change resets to page 1 so the
 * user never lands on an out-of-range page. Pure list operations live in
 * `lib/catalog` and are unit-tested independently.
 */
export function useCatalog(products: readonly Product[]): UseCatalogResult {
  const [activeColors, setActiveColors] = useState<ReadonlySet<ColorKey>>(
    () => new Set(),
  );
  const [activeCollars, setActiveCollars] = useState<ReadonlySet<CollarType>>(
    () => new Set(),
  );
  const [activeTypes, setActiveTypes] = useState<ReadonlySet<ProductType>>(
    () => new Set(),
  );
  const [sort, setSortState] = useState<SortKey>("popularity");
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState<number>(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        colors: activeColors,
        collars: activeCollars,
        types: activeTypes,
      }),
    [products, activeColors, activeCollars, activeTypes],
  );

  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);

  const totalCount = sorted.length;
  const totalPages = pageCount(totalCount, pageSize);
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => paginate(sorted, safePage, pageSize),
    [sorted, safePage, pageSize],
  );

  const setPage = useCallback((next: number) => setPageState(next), []);
  const setPageSize = useCallback((next: number) => {
    setPageSizeState(next);
    setPageState(1);
  }, []);
  const setSort = useCallback((next: SortKey) => {
    setSortState(next);
    setPageState(1);
  }, []);

  const toggleColor = useCallback((color: ColorKey) => {
    setActiveColors((current) => toggleInSet(current, color));
    setPageState(1);
  }, []);
  const toggleCollar = useCallback((collar: CollarType) => {
    setActiveCollars((current) => toggleInSet(current, collar));
    setPageState(1);
  }, []);
  const toggleType = useCallback((type: ProductType) => {
    setActiveTypes((current) => toggleInSet(current, type));
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveColors(new Set());
    setActiveCollars(new Set());
    setActiveTypes(new Set());
    setPageState(1);
  }, []);

  const rangeStart = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalCount);
  const hasActiveFilters =
    activeColors.size > 0 || activeCollars.size > 0 || activeTypes.size > 0;

  return {
    pageItems,
    totalCount,
    totalPages,
    page: safePage,
    pageSize,
    rangeStart,
    rangeEnd,
    sort,
    activeColors,
    activeCollars,
    activeTypes,
    hasActiveFilters,
    setSort,
    setPage,
    setPageSize,
    toggleColor,
    toggleCollar,
    toggleType,
    clearFilters,
  };
}
