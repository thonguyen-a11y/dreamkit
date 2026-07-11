/**
 * Pure validation for the auth forms.
 *
 * Kept framework-agnostic (no React) so the rules are trivially unit-testable
 * and can be reused by a real backend/server action later.
 */

export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {};

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Email không hợp lệ.";
  }
  if (!values.password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  }

  return errors;
}

export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {};

  if (!values.name.trim()) {
    errors.name = "Vui lòng nhập họ tên.";
  }
  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Email không hợp lệ.";
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Mật khẩu cần tối thiểu ${MIN_PASSWORD_LENGTH} ký tự.`;
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp.";
  }
  if (!values.address.trim()) {
    errors.address = "Vui lòng nhập địa chỉ.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  }

  return errors;
}

/** True when an error map has no entries. */
export function isValid<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0;
}
