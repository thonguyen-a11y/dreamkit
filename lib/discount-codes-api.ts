import { apiFetch } from "./api-client";
import { normalizeDiscountCode } from "./discount-codes";
import type { DiscountCode, DiscountType } from "./types";

/** Discount code shape returned by the NestJS discount codes API. */
export interface ApiDiscountCode {
  readonly _id: string;
  readonly code: string;
  readonly description?: string;
  readonly discountType: DiscountType;
  readonly value: number;
  readonly minOrderAmount?: number;
  readonly startsAt?: string;
  readonly expiresAt?: string;
  readonly maxUses?: number;
  readonly perCustomerLimit?: number;
  readonly isActive: boolean;
  readonly usedCount: number;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

export interface DiscountCodesListResponse {
  readonly data: readonly ApiDiscountCode[];
}

export interface FetchDiscountCodesSuccess {
  readonly ok: true;
  readonly discountCodes: readonly DiscountCode[];
}

export interface FetchDiscountCodesFailure {
  readonly ok: false;
  readonly message: string;
}

export type FetchDiscountCodesResult =
  | FetchDiscountCodesSuccess
  | FetchDiscountCodesFailure;

export interface DiscountCodeMutationSuccess {
  readonly ok: true;
  readonly discountCode: DiscountCode;
}

export interface DiscountCodeMutationFailure {
  readonly ok: false;
  readonly status: number;
  readonly message: string;
}

export type DiscountCodeMutationResult =
  | DiscountCodeMutationSuccess
  | DiscountCodeMutationFailure;

export interface DeleteDiscountCodeSuccess {
  readonly ok: true;
}

export interface DeleteDiscountCodeFailure {
  readonly ok: false;
  readonly status: number;
  readonly message: string;
}

export type DeleteDiscountCodeResult =
  | DeleteDiscountCodeSuccess
  | DeleteDiscountCodeFailure;

/** Fields the admin form can create or update a discount code with. */
export type DiscountCodeInput = Omit<
  DiscountCode,
  "id" | "usedCount" | "createdAt"
>;

/** Maps a backend discount code record to the frontend admin model. */
export function mapApiDiscountCodeToDiscountCode(
  apiDiscountCode: ApiDiscountCode,
): DiscountCode {
  return {
    id: apiDiscountCode._id,
    code: apiDiscountCode.code,
    description: apiDiscountCode.description,
    discountType: apiDiscountCode.discountType,
    value: apiDiscountCode.value,
    minOrderAmount: apiDiscountCode.minOrderAmount,
    startsAt: apiDiscountCode.startsAt,
    expiresAt: apiDiscountCode.expiresAt,
    maxUses: apiDiscountCode.maxUses,
    perCustomerLimit: apiDiscountCode.perCustomerLimit,
    isActive: apiDiscountCode.isActive,
    usedCount: apiDiscountCode.usedCount,
    createdAt: apiDiscountCode.createdAt,
  };
}

function authHeaders(accessToken: string): HeadersInit {
  return { Authorization: `Bearer ${accessToken}` };
}

/** Lists all discount codes. Admin only. */
export async function fetchDiscountCodesApi(
  accessToken: string,
): Promise<FetchDiscountCodesResult> {
  const result = await apiFetch<DiscountCodesListResponse>("/api/discount-codes", {
    method: "GET",
    headers: authHeaders(accessToken),
  });

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return {
    ok: true,
    discountCodes: result.data.data.map(mapApiDiscountCodeToDiscountCode),
  };
}

/** Creates a discount code. Admin only. */
export async function createDiscountCodeApi(
  accessToken: string,
  input: DiscountCodeInput,
): Promise<DiscountCodeMutationResult> {
  const result = await apiFetch<ApiDiscountCode>("/api/discount-codes", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(input),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true, discountCode: mapApiDiscountCodeToDiscountCode(result.data) };
}

/** Updates a discount code. Admin only. */
export async function updateDiscountCodeApi(
  accessToken: string,
  id: string,
  input: Partial<DiscountCodeInput>,
): Promise<DiscountCodeMutationResult> {
  const result = await apiFetch<ApiDiscountCode>(`/api/discount-codes/${id}`, {
    method: "PATCH",
    headers: authHeaders(accessToken),
    body: JSON.stringify(input),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true, discountCode: mapApiDiscountCodeToDiscountCode(result.data) };
}

export interface ValidateDiscountCodeSuccess {
  readonly ok: true;
  readonly discountCode: DiscountCode;
}

export interface ValidateDiscountCodeFailure {
  readonly ok: false;
  readonly message: string;
}

export type ValidateDiscountCodeResult =
  | ValidateDiscountCodeSuccess
  | ValidateDiscountCodeFailure;

/** Looks up a discount code by its code string for checkout. Public; no admin token required. */
export async function validateDiscountCodeApi(
  code: string,
): Promise<ValidateDiscountCodeResult> {
  const result = await apiFetch<ApiDiscountCode>(
    `/api/discount-codes/validate/${encodeURIComponent(normalizeDiscountCode(code))}`,
    { method: "GET" },
  );

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  return { ok: true, discountCode: mapApiDiscountCodeToDiscountCode(result.data) };
}

/** Deletes a discount code. Admin only. */
export async function deleteDiscountCodeApi(
  accessToken: string,
  id: string,
): Promise<DeleteDiscountCodeResult> {
  const result = await apiFetch<undefined>(`/api/discount-codes/${id}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });

  if (!result.ok) {
    return { ok: false, status: result.status, message: result.message };
  }

  return { ok: true };
}
