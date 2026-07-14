/** Clothing sizes offered across the catalogue; not product-specific. */
export const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export function isProductSize(value: string): value is ProductSize {
  return (PRODUCT_SIZES as readonly string[]).includes(value);
}
