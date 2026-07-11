import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createDiscountCodeApi,
  deleteDiscountCodeApi,
  fetchDiscountCodesApi,
  mapApiDiscountCodeToDiscountCode,
  updateDiscountCodeApi,
} from "./discount-codes-api";

const API_DISCOUNT_CODE = {
  _id: "6a4b68f19d7d69258ee3978f",
  code: "SUMMER20",
  description: "Khuyến mãi hè",
  discountType: "percentage",
  value: 20,
  isActive: true,
  usedCount: 3,
  createdAt: "2026-01-01T00:00:00.000Z",
} as const;

describe("mapApiDiscountCodeToDiscountCode", () => {
  it("maps API fields to the admin discount code model", () => {
    expect(mapApiDiscountCodeToDiscountCode(API_DISCOUNT_CODE)).toEqual({
      id: API_DISCOUNT_CODE._id,
      code: API_DISCOUNT_CODE.code,
      description: API_DISCOUNT_CODE.description,
      discountType: "percentage",
      value: 20,
      minOrderAmount: undefined,
      startsAt: undefined,
      expiresAt: undefined,
      maxUses: undefined,
      perCustomerLimit: undefined,
      isActive: true,
      usedCount: 3,
      createdAt: API_DISCOUNT_CODE.createdAt,
    });
  });
});

describe("fetchDiscountCodesApi / createDiscountCodeApi / updateDiscountCodeApi / deleteDiscountCodeApi", () => {
  const fetchMock = vi.fn();

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("fetches and maps the discount code list", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [API_DISCOUNT_CODE] }),
    });

    const result = await fetchDiscountCodesApi("token-123");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCodes).toHaveLength(1);
      expect(result.discountCodes[0]?.id).toBe(API_DISCOUNT_CODE._id);
    }
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discount-codes",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
      }),
    );
  });

  it("surfaces a failure message when the list request fails", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Admin role required" }),
    });

    const result = await fetchDiscountCodesApi("token-123");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Admin role required");
    }
  });

  it("creates a discount code", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => API_DISCOUNT_CODE,
    });

    const result = await createDiscountCodeApi("token-123", {
      code: "SUMMER20",
      discountType: "percentage",
      value: 20,
      isActive: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCode.code).toBe("SUMMER20");
    }
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/discount-codes",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("surfaces a duplicate-code error on create", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      statusText: "Conflict",
      json: async () => ({ message: "Mã giảm giá đã tồn tại" }),
    });

    const result = await createDiscountCodeApi("token-123", {
      code: "SUMMER20",
      discountType: "percentage",
      value: 20,
      isActive: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(409);
    }
  });

  it("updates a discount code", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ...API_DISCOUNT_CODE, value: 30 }),
    });

    const result = await updateDiscountCodeApi("token-123", API_DISCOUNT_CODE._id, {
      value: 30,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.discountCode.value).toBe(30);
    }
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/discount-codes/${API_DISCOUNT_CODE._id}`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ value: 30 }),
      }),
    );
  });

  it("deletes a discount code", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({ ok: true, status: 204 });

    const result = await deleteDiscountCodeApi("token-123", API_DISCOUNT_CODE._id);

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/discount-codes/${API_DISCOUNT_CODE._id}`,
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("surfaces a failure status when delete fails", async () => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Không tìm thấy mã giảm giá" }),
    });

    const result = await deleteDiscountCodeApi("token-123", "missing-id");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
    }
  });
});
