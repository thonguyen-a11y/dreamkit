import type { Product } from "./types";

/** A single line in the cart: a product reference + quantity. */
export interface CartLine {
  readonly id: string;
  readonly quantity: number;
}

/** A cart line resolved against the catalogue, ready for display. */
export interface CartDetailLine {
  readonly product: Product;
  readonly quantity: number;
  readonly lineTotal: number;
}

export interface CartSummary {
  readonly items: readonly CartDetailLine[];
  readonly subtotal: number;
  readonly count: number;
}

const MAX_QUANTITY = 99;

function clampQuantity(quantity: number): number {
  return Math.max(1, Math.min(MAX_QUANTITY, Math.floor(quantity)));
}

/** Adds `quantity` of a product, merging with an existing line if present. */
export function addLine(
  lines: readonly CartLine[],
  id: string,
  quantity = 1,
): readonly CartLine[] {
  const existing = lines.find((line) => line.id === id);
  if (existing) {
    return lines.map((line) =>
      line.id === id
        ? { ...line, quantity: clampQuantity(line.quantity + quantity) }
        : line,
    );
  }
  return [...lines, { id, quantity: clampQuantity(quantity) }];
}

export function removeLine(
  lines: readonly CartLine[],
  id: string,
): readonly CartLine[] {
  return lines.filter((line) => line.id !== id);
}

/** Sets an absolute quantity; a value below 1 removes the line entirely. */
export function setLineQuantity(
  lines: readonly CartLine[],
  id: string,
  quantity: number,
): readonly CartLine[] {
  if (quantity < 1) {
    return removeLine(lines, id);
  }
  return lines.map((line) =>
    line.id === id ? { ...line, quantity: clampQuantity(quantity) } : line,
  );
}

export function cartCount(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/**
 * Resolves cart lines against the product catalogue, computing per-line and
 * subtotal amounts. Lines whose product no longer exists are dropped so a
 * stale persisted cart can never crash the UI.
 */
export function summarizeCart(
  lines: readonly CartLine[],
  products: readonly Product[],
): CartSummary {
  const byId = new Map(products.map((product) => [product.id, product]));
  const items: CartDetailLine[] = [];
  let subtotal = 0;
  let count = 0;

  for (const line of lines) {
    const product = byId.get(line.id);
    if (!product) {
      continue;
    }
    const lineTotal = product.price * line.quantity;
    subtotal += lineTotal;
    count += line.quantity;
    items.push({ product, quantity: line.quantity, lineTotal });
  }

  return { items, subtotal, count };
}

/** Validates/normalises an unknown value parsed from storage into cart lines. */
export function parseCartLines(value: unknown): readonly CartLine[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter(
      (entry): entry is CartLine =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as CartLine).id === "string" &&
        typeof (entry as CartLine).quantity === "number",
    )
    .map((entry) => ({ id: entry.id, quantity: clampQuantity(entry.quantity) }));
}
