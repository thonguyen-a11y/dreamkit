import { describe, expect, it } from "vitest";
import { createOrder, getOrdersForUser, parseOrders, updateOrderStatus } from "./orders";
import type { Product } from "./types";

const PRODUCT: Product = {
  id: "kit-a",
  name: "Kit A",
  price: 210_000,
  category: "Set quần áo bóng đá",
  colors: ["red"],
  primaryColor: "red",
  image: "https://example.com/a.jpg",
  collar: "regular",
  type: "set",
  isNew: true,
};

describe("createOrder", () => {
  it("builds an order from cart lines", () => {
    const order = createOrder(
      {
        customerName: "Nguyễn Văn A",
        customerPhone: "0900000000",
        customerEmail: "a@dreamkit.vn",
        lines: [{ id: "kit-a", quantity: 2 }],
      },
      [PRODUCT],
      [],
    );

    expect(order).not.toBeNull();
    expect(order?.subtotal).toBe(420_000);
    expect(order?.lines).toHaveLength(1);
    expect(order?.status).toBe("pending");
  });

  it("returns null when no valid lines remain", () => {
    const order = createOrder(
      {
        customerName: "Nguyễn Văn A",
        customerPhone: "0900000000",
        customerEmail: "a@dreamkit.vn",
        lines: [{ id: "missing", quantity: 1 }],
      },
      [PRODUCT],
      [],
    );

    expect(order).toBeNull();
  });
});

describe("createOrder discounts and optional email", () => {
  it("applies a pre-validated discount amount to compute the total", () => {
    const order = createOrder(
      {
        customerName: "Nguyễn Văn A",
        customerPhone: "0900000000",
        lines: [{ id: "kit-a", quantity: 2 }],
        discountCode: "SUMMER20",
        discountAmount: 50_000,
      },
      [PRODUCT],
      [],
    );

    expect(order?.subtotal).toBe(420_000);
    expect(order?.discountCode).toBe("SUMMER20");
    expect(order?.discountAmount).toBe(50_000);
    expect(order?.total).toBe(370_000);
  });

  it("clamps a discount amount larger than the subtotal", () => {
    const order = createOrder(
      {
        customerName: "Nguyễn Văn A",
        customerPhone: "0900000000",
        lines: [{ id: "kit-a", quantity: 1 }],
        discountAmount: 999_999_999,
      },
      [PRODUCT],
      [],
    );

    expect(order?.total).toBe(0);
  });

  it("creates an order without an email", () => {
    const order = createOrder(
      {
        customerName: "Nguyễn Văn A",
        customerPhone: "0900000000",
        lines: [{ id: "kit-a", quantity: 1 }],
      },
      [PRODUCT],
      [],
    );

    expect(order?.customerEmail).toBeUndefined();
    expect(order?.total).toBe(order?.subtotal);
  });
});

describe("parseOrders", () => {
  it("defaults discountAmount and total for orders stored before those fields existed", () => {
    const stored = [
      {
        id: "order-1",
        orderNumber: "DK-0001",
        customerName: "A",
        customerPhone: "1",
        customerEmail: "a@dreamkit.vn",
        lines: [],
        subtotal: 100_000,
        status: "pending",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const [order] = parseOrders(stored);
    expect(order?.discountAmount).toBe(0);
    expect(order?.total).toBe(100_000);
  });
});

describe("updateOrderStatus", () => {
  it("updates the matching order status", () => {
    const orders = [
      {
        id: "order-1",
        orderNumber: "DK-0001",
        customerName: "A",
        customerPhone: "1",
        customerEmail: "a@dreamkit.vn",
        lines: [],
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        status: "pending" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const next = updateOrderStatus(orders, "order-1", "confirmed");
    expect(next[0]?.status).toBe("confirmed");
  });
});

describe("getOrdersForUser", () => {
  it("returns orders linked by user id or email", () => {
    const orders = [
      {
        id: "order-1",
        orderNumber: "DK-0001",
        userId: "user-1",
        customerName: "A",
        customerPhone: "1",
        customerEmail: "a@dreamkit.vn",
        lines: [],
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        status: "pending" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "order-2",
        orderNumber: "DK-0002",
        customerName: "B",
        customerPhone: "2",
        customerEmail: "b@dreamkit.vn",
        lines: [],
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        status: "pending" as const,
        createdAt: "2026-01-02T00:00:00.000Z",
      },
    ];

    const result = getOrdersForUser(orders, {
      id: "user-1",
      name: "A",
      email: "a@dreamkit.vn",
      role: "customer",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.orderNumber).toBe("DK-0001");
  });

  it("matches an order lacking an email only by user id", () => {
    const orders = [
      {
        id: "order-1",
        orderNumber: "DK-0001",
        userId: "user-1",
        customerName: "A",
        customerPhone: "1",
        lines: [],
        subtotal: 0,
        discountAmount: 0,
        total: 0,
        status: "pending" as const,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];

    const result = getOrdersForUser(orders, {
      id: "user-1",
      name: "A",
      email: "a@dreamkit.vn",
      role: "customer",
    });

    expect(result).toHaveLength(1);
  });
});
