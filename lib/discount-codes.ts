import type { DiscountCode, DiscountCodeStatus, DiscountType } from "./types";

export type DiscountCodeField = keyof DiscountCode;

export type DiscountCodeFieldErrors = Partial<Record<DiscountCodeField, string>>;

const DISCOUNT_TYPES: readonly DiscountType[] = ["percentage", "fixed"];

/** Normalizes a discount code string for storage and comparison: trims and uppercases it. */
export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Computes a discount code's current lifecycle status; never stored, always derived. */
export function computeDiscountCodeStatus(
  discountCode: DiscountCode,
  now: Date = new Date(),
): DiscountCodeStatus {
  if (!discountCode.isActive) {
    return "disabled";
  }

  if (discountCode.expiresAt && now.getTime() > new Date(discountCode.expiresAt).getTime()) {
    return "expired";
  }

  if (
    discountCode.maxUses !== undefined &&
    discountCode.usedCount >= discountCode.maxUses
  ) {
    return "exhausted";
  }

  if (discountCode.startsAt && now.getTime() < new Date(discountCode.startsAt).getTime()) {
    return "scheduled";
  }

  return "active";
}

export function validateDiscountCode(
  discountCode: DiscountCode,
  existingCodes: readonly DiscountCode[],
  originalId?: string,
): DiscountCodeFieldErrors {
  const errors: DiscountCodeFieldErrors = {};

  const normalizedCode = normalizeDiscountCode(discountCode.code);
  if (!normalizedCode) {
    errors.code = "Mã giảm giá là bắt buộc";
  } else if (
    existingCodes.some(
      (entry) =>
        entry.id !== originalId &&
        normalizeDiscountCode(entry.code) === normalizedCode,
    )
  ) {
    errors.code = "Mã giảm giá đã tồn tại";
  }

  if (!DISCOUNT_TYPES.includes(discountCode.discountType)) {
    errors.discountType = "Loại giảm giá không hợp lệ";
  } else if (discountCode.discountType === "percentage") {
    if (
      !Number.isFinite(discountCode.value) ||
      discountCode.value < 1 ||
      discountCode.value > 100
    ) {
      errors.value = "Phần trăm giảm giá phải trong khoảng 1-100";
    }
  } else if (!Number.isFinite(discountCode.value) || discountCode.value < 0) {
    errors.value = "Số tiền giảm giá phải là số không âm";
  }

  if (
    discountCode.minOrderAmount !== undefined &&
    (!Number.isFinite(discountCode.minOrderAmount) || discountCode.minOrderAmount < 0)
  ) {
    errors.minOrderAmount = "Giá trị đơn hàng tối thiểu phải là số không âm";
  }

  if (
    discountCode.maxUses !== undefined &&
    (!Number.isInteger(discountCode.maxUses) || discountCode.maxUses < 0)
  ) {
    errors.maxUses = "Số lượt sử dụng tối đa phải là số nguyên không âm";
  }

  if (
    discountCode.perCustomerLimit !== undefined &&
    (!Number.isInteger(discountCode.perCustomerLimit) || discountCode.perCustomerLimit < 0)
  ) {
    errors.perCustomerLimit = "Giới hạn mỗi khách hàng phải là số nguyên không âm";
  }

  if (
    discountCode.startsAt &&
    discountCode.expiresAt &&
    new Date(discountCode.expiresAt).getTime() < new Date(discountCode.startsAt).getTime()
  ) {
    errors.expiresAt = "Ngày hết hạn phải sau ngày bắt đầu";
  }

  return errors;
}

export function isDiscountCodeValid(errors: DiscountCodeFieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

/** Why a discount code could not be applied to an order. */
export type DiscountApplyFailureReason = Exclude<DiscountCodeStatus, "active"> | "below_minimum";

export type ApplyDiscountCodeResult =
  | { readonly ok: true; readonly discountAmount: number }
  | {
      readonly ok: false;
      readonly reason: DiscountApplyFailureReason;
      readonly minOrderAmount?: number;
    };

/**
 * Computes the discount amount a code contributes to an order subtotal, or the
 * reason it cannot be applied right now (not active, or subtotal too low).
 */
export function applyDiscountCode(
  discountCode: DiscountCode,
  subtotal: number,
  now: Date = new Date(),
): ApplyDiscountCodeResult {
  const status = computeDiscountCodeStatus(discountCode, now);
  if (status !== "active") {
    return { ok: false, reason: status };
  }

  if (discountCode.minOrderAmount !== undefined && subtotal < discountCode.minOrderAmount) {
    return { ok: false, reason: "below_minimum", minOrderAmount: discountCode.minOrderAmount };
  }

  const rawAmount =
    discountCode.discountType === "percentage"
      ? (subtotal * discountCode.value) / 100
      : discountCode.value;

  const discountAmount = Math.min(Math.max(Math.round(rawAmount), 0), subtotal);
  return { ok: true, discountAmount };
}

export function upsertDiscountCode(
  discountCodes: readonly DiscountCode[],
  discountCode: DiscountCode,
  originalId?: string,
): readonly DiscountCode[] {
  const withoutOriginal = originalId
    ? discountCodes.filter((entry) => entry.id !== originalId)
    : discountCodes.filter((entry) => entry.id !== discountCode.id);

  return [...withoutOriginal, discountCode];
}

export function deleteDiscountCode(
  discountCodes: readonly DiscountCode[],
  id: string,
): readonly DiscountCode[] {
  return discountCodes.filter((discountCode) => discountCode.id !== id);
}
