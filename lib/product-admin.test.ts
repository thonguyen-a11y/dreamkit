import { describe, expect, it } from "vitest";
import {
  deleteProduct,
  slugifyProductId,
  upsertProduct,
  validateProduct,
} from "./product-admin";
import type { Product } from "./types";

const BASE: Product = {
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

describe("slugifyProductId", () => {
  it("normalises Vietnamese product names", () => {
    expect(slugifyProductId("Áo Đà Nẵng Storm")).toBe("ao-da-nang-storm");
  });
});

describe("validateProduct", () => {
  it("flags duplicate ids", () => {
    const errors = validateProduct(BASE, [BASE]);
    expect(errors.id).toBeTruthy();
  });
});

describe("upsertProduct", () => {
  it("replaces an existing product", () => {
    const updated = { ...BASE, name: "Kit B" };
    const next = upsertProduct([BASE], updated);
    expect(next).toHaveLength(1);
    expect(next[0]?.name).toBe("Kit B");
  });
});

describe("deleteProduct", () => {
  it("removes a product by id", () => {
    expect(deleteProduct([BASE], "kit-a")).toEqual([]);
  });
});
