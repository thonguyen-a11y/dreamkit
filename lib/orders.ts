import type { CartLine } from "./cart";
import type { AuthUser, Order, OrderLine, OrderStatus, Product } from "./types";

export interface CreateOrderInput {
  readonly userId?: string;
  readonly customerName: string;
  readonly customerPhone: string;
  readonly customerEmail?: string;
  readonly lines: readonly CartLine[];
  readonly notes?: string;
  /** Normalized discount code string already validated against the subtotal by the caller. */
  readonly discountCode?: string;
  /** Discount amount already computed (e.g. via `applyDiscountCode`) for `discountCode`. */
  readonly discountAmount?: number;
}

export const ORDER_STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đã giao hàng",
  delivered: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function buildOrderLines(
  lines: readonly CartLine[],
  products: readonly Product[],
): readonly OrderLine[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const orderLines: OrderLine[] = [];

  for (const line of lines) {
    const product = byId.get(line.id);
    if (!product) {
      continue;
    }
    orderLines.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: line.quantity,
      lineTotal: product.price * line.quantity,
    });
  }

  return orderLines;
}

/** Creates an order from cart lines resolved against the product catalogue. */
export function createOrder(
  input: CreateOrderInput,
  products: readonly Product[],
  existingOrders: readonly Order[],
): Order | null {
  const lines = buildOrderLines(input.lines, products);
  if (lines.length === 0) {
    return null;
  }

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const discountAmount = Math.min(Math.max(input.discountAmount ?? 0, 0), subtotal);
  const createdAt = new Date().toISOString();
  const orderNumber = `DK-${String(existingOrders.length + 1).padStart(4, "0")}`;

  return {
    id: `order-${Date.now()}`,
    orderNumber,
    userId: input.userId,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    customerEmail: input.customerEmail?.trim() || undefined,
    lines,
    subtotal,
    discountCode: input.discountCode,
    discountAmount,
    total: subtotal - discountAmount,
    status: "pending",
    createdAt,
    notes: input.notes?.trim() || undefined,
  };
}

export function updateOrderStatus(
  orders: readonly Order[],
  id: string,
  status: OrderStatus,
): readonly Order[] {
  return orders.map((order) => (order.id === id ? { ...order, status } : order));
}

export function removeOrder(
  orders: readonly Order[],
  id: string,
): readonly Order[] {
  return orders.filter((order) => order.id !== id);
}

/** Returns orders belonging to the signed-in customer. */
export function getOrdersForUser(
  orders: readonly Order[],
  user: AuthUser,
): readonly Order[] {
  return orders.filter(
    (order) =>
      order.userId === user.id ||
      order.customerEmail?.toLowerCase() === user.email.toLowerCase(),
  );
}

/** Validates/normalises orders parsed from storage, defaulting fields added after older orders were saved. */
export function parseOrders(value: unknown): readonly Order[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const orders: Order[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }
    const order = entry as Order;
    const isValid =
      typeof order.id === "string" &&
      typeof order.orderNumber === "string" &&
      typeof order.customerName === "string" &&
      typeof order.customerPhone === "string" &&
      typeof order.subtotal === "number" &&
      typeof order.status === "string" &&
      typeof order.createdAt === "string" &&
      Array.isArray(order.lines);
    if (!isValid) {
      continue;
    }

    const discountAmount =
      typeof order.discountAmount === "number" ? order.discountAmount : 0;
    orders.push({
      ...order,
      customerEmail:
        typeof order.customerEmail === "string" ? order.customerEmail : undefined,
      discountAmount,
      total: typeof order.total === "number" ? order.total : order.subtotal - discountAmount,
    });
  }

  return orders;
}
