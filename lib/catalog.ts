import type {
  CollarType,
  ColorKey,
  Product,
  ProductType,
} from "./types";

/** Sort options offered in the shop toolbar (mirrors the WooCommerce store). */
export type SortKey =
  | "popularity"
  | "rating"
  | "latest"
  | "price-asc"
  | "price-desc";

export interface CatalogFilters {
  readonly colors: ReadonlySet<ColorKey>;
  readonly collars: ReadonlySet<CollarType>;
  readonly types: ReadonlySet<ProductType>;
}

export const PAGE_SIZE = 12;

/** Selectable "items per page" limits offered in the toolbar. */
export const PAGE_SIZE_OPTIONS: readonly number[] = [6, 12, 24];

export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: "popularity", label: "Thứ tự theo mức độ phổ biến" },
  { value: "rating", label: "Thứ tự theo điểm đánh giá" },
  { value: "latest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: thấp đến cao" },
  { value: "price-desc", label: "Giá: cao xuống thấp" },
];

/**
 * Filters products against the active facets. Within a facet the match is OR
 * (any selected value), across facets it is AND — the standard e-commerce
 * faceted-search behaviour. An empty facet imposes no constraint.
 */
export function filterProducts(
  products: readonly Product[],
  filters: CatalogFilters,
): readonly Product[] {
  return products.filter((product) => {
    const colorMatch =
      filters.colors.size === 0 ||
      product.colors.some((color) => filters.colors.has(color));
    const collarMatch =
      filters.collars.size === 0 || filters.collars.has(product.collar);
    const typeMatch =
      filters.types.size === 0 || filters.types.has(product.type);
    return colorMatch && collarMatch && typeMatch;
  });
}

/** Returns a new, sorted array (does not mutate the input). */
export function sortProducts(
  products: readonly Product[],
  sort: SortKey,
): readonly Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "latest":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "rating":
    case "popularity":
    default:
      return copy;
  }
}

/** Slices the list for the given 1-based page. */
export function paginate(
  products: readonly Product[],
  page: number,
  pageSize: number = PAGE_SIZE,
): readonly Product[] {
  const start = (page - 1) * pageSize;
  return products.slice(start, start + pageSize);
}

export function pageCount(
  total: number,
  pageSize: number = PAGE_SIZE,
): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Counts how many products carry each value of the given key. */
export function countBy<K extends keyof Product>(
  products: readonly Product[],
  key: K,
): Map<Product[K], number> {
  const counts = new Map<Product[K], number>();
  for (const product of products) {
    counts.set(product[key], (counts.get(product[key]) ?? 0) + 1);
  }
  return counts;
}

/** Counts products per colour (a product contributes to each of its colours). */
export function countColors(
  products: readonly Product[],
): Map<ColorKey, number> {
  const counts = new Map<ColorKey, number>();
  for (const product of products) {
    for (const color of product.colors) {
      counts.set(color, (counts.get(color) ?? 0) + 1);
    }
  }
  return counts;
}
