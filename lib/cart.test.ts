import { describe, expect, it } from "vitest";
import {
  addLine,
  cartCount,
  parseCartLines,
  removeLine,
  setLineQuantity,
  summarizeCart,
  type CartLine,
} from "./cart";
import type { Product } from "./types";

function product(id: string, price: number): Product {
  return {
    id,
    name: id,
    price,
    category: "x",
    colors: ["red"],
    primaryColor: "red",
    image: `${id}.jpg`,
    collar: "regular",
    type: "set",
    isNew: false,
  };
}

const PRODUCTS = [product("a", 100), product("b", 200)];

describe("addLine", () => {
  it("appends a new line", () => {
    expect(addLine([], "a")).toEqual([{ id: "a", quantity: 1 }]);
  });

  it("merges quantity into an existing line", () => {
    const lines = addLine([{ id: "a", quantity: 2 }], "a", 3);
    expect(lines).toEqual([{ id: "a", quantity: 5 }]);
  });

  it("clamps quantity to the max", () => {
    expect(addLine([], "a", 500)[0].quantity).toBe(99);
  });
});

describe("setLineQuantity", () => {
  it("updates an absolute quantity", () => {
    expect(setLineQuantity([{ id: "a", quantity: 1 }], "a", 4)).toEqual([
      { id: "a", quantity: 4 },
    ]);
  });

  it("removes the line when set below 1", () => {
    expect(setLineQuantity([{ id: "a", quantity: 1 }], "a", 0)).toEqual([]);
  });
});

describe("removeLine / cartCount", () => {
  it("removes a line", () => {
    expect(removeLine([{ id: "a", quantity: 1 }], "a")).toEqual([]);
  });

  it("counts total quantity", () => {
    expect(
      cartCount([
        { id: "a", quantity: 2 },
        { id: "b", quantity: 3 },
      ]),
    ).toBe(5);
  });
});

describe("summarizeCart", () => {
  it("computes line totals and subtotal", () => {
    const lines: CartLine[] = [
      { id: "a", quantity: 2 },
      { id: "b", quantity: 1 },
    ];
    const summary = summarizeCart(lines, PRODUCTS);
    expect(summary.subtotal).toBe(400);
    expect(summary.count).toBe(3);
    expect(summary.items).toHaveLength(2);
    expect(summary.items[0].lineTotal).toBe(200);
  });

  it("drops lines for unknown products", () => {
    const summary = summarizeCart([{ id: "ghost", quantity: 1 }], PRODUCTS);
    expect(summary.items).toHaveLength(0);
    expect(summary.subtotal).toBe(0);
  });
});

describe("parseCartLines", () => {
  it("returns [] for non-array input", () => {
    expect(parseCartLines("nope")).toEqual([]);
  });

  it("keeps only well-formed entries", () => {
    const parsed = parseCartLines([
      { id: "a", quantity: 2 },
      { id: "b" },
      { quantity: 3 },
      42,
    ]);
    expect(parsed).toEqual([{ id: "a", quantity: 2 }]);
  });
});
