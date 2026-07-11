import { describe, expect, it } from "vitest";
import {
  computeDiscountCodeStatus,
  deleteDiscountCode,
  normalizeDiscountCode,
  upsertDiscountCode,
  validateDiscountCode,
} from "./discount-codes";
import type { DiscountCode } from "./types";

const BASE: DiscountCode = {
  id: "code-1",
  code: "SUMMER20",
  discountType: "percentage",
  value: 20,
  isActive: true,
  usedCount: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("normalizeDiscountCode", () => {
  it("trims whitespace and uppercases the code", () => {
    expect(normalizeDiscountCode("  summer20 ")).toBe("SUMMER20");
  });
});

describe("validateDiscountCode", () => {
  it("requires a non-empty code", () => {
    const errors = validateDiscountCode({ ...BASE, code: "   " }, []);
    expect(errors.code).toBeTruthy();
  });

  it("flags a duplicate code regardless of case or whitespace", () => {
    const errors = validateDiscountCode(
      { ...BASE, id: "code-2", code: " summer20 " },
      [BASE],
    );
    expect(errors.code).toBeTruthy();
  });

  it("does not flag a code against itself when editing", () => {
    const errors = validateDiscountCode(BASE, [BASE], BASE.id);
    expect(errors.code).toBeUndefined();
  });

  it("rejects a percentage value outside 1-100", () => {
    const errors = validateDiscountCode({ ...BASE, value: 150 }, []);
    expect(errors.value).toBeTruthy();
  });

  it("rejects a negative fixed amount", () => {
    const errors = validateDiscountCode(
      { ...BASE, discountType: "fixed", value: -10 },
      [],
    );
    expect(errors.value).toBeTruthy();
  });

  it("accepts a valid fixed amount of zero", () => {
    const errors = validateDiscountCode(
      { ...BASE, discountType: "fixed", value: 0 },
      [],
    );
    expect(errors.value).toBeUndefined();
  });

  it("rejects an expiry date earlier than the start date", () => {
    const errors = validateDiscountCode(
      { ...BASE, startsAt: "2026-06-01", expiresAt: "2026-05-01" },
      [],
    );
    expect(errors.expiresAt).toBeTruthy();
  });
});

describe("computeDiscountCodeStatus", () => {
  const now = new Date("2026-06-15T00:00:00.000Z");

  it("returns disabled when isActive is false, regardless of other rules", () => {
    expect(computeDiscountCodeStatus({ ...BASE, isActive: false }, now)).toBe(
      "disabled",
    );
  });

  it("returns expired when now is after expiresAt", () => {
    expect(
      computeDiscountCodeStatus({ ...BASE, expiresAt: "2026-06-01" }, now),
    ).toBe("expired");
  });

  it("returns exhausted when usedCount reaches maxUses", () => {
    expect(
      computeDiscountCodeStatus({ ...BASE, maxUses: 5, usedCount: 5 }, now),
    ).toBe("exhausted");
  });

  it("returns scheduled when now is before startsAt", () => {
    expect(
      computeDiscountCodeStatus({ ...BASE, startsAt: "2026-07-01" }, now),
    ).toBe("scheduled");
  });

  it("returns active when no blocking rule applies", () => {
    expect(
      computeDiscountCodeStatus(
        { ...BASE, startsAt: "2026-01-01", expiresAt: "2026-12-31", maxUses: 100 },
        now,
      ),
    ).toBe("active");
  });
});

describe("upsertDiscountCode", () => {
  it("replaces an existing discount code by id", () => {
    const updated = { ...BASE, value: 30 };
    const next = upsertDiscountCode([BASE], updated);
    expect(next).toHaveLength(1);
    expect(next[0]?.value).toBe(30);
  });
});

describe("deleteDiscountCode", () => {
  it("removes a discount code by id", () => {
    expect(deleteDiscountCode([BASE], BASE.id)).toEqual([]);
  });
});
