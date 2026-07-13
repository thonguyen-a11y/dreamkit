"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast-context";
import {
  isValid,
  validateRegister,
  type FieldErrors,
  type RegisterValues,
} from "@/lib/auth-validation";
import { useAuthModal } from "./auth-modal-context";
import { TextField } from "./text-field";

const EMPTY: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  phone: "",
};

interface RegisterFormProps {
  onRegistered: (email: string) => void;
}

export function RegisterForm({ onRegistered }: RegisterFormProps) {
  const { register } = useAuthModal();
  const { showToast } = useToast();
  const [values, setValues] = useState<RegisterValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<RegisterValues>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    setSuccessMessage(null);

    if (!isValid(nextErrors)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(values);
      if (!result.ok) {
        showToast(result.message, "error");
        return;
      }

      showToast(result.message, "success");
      setSuccessMessage(result.message);
      setValues(EMPTY);
      onRegistered(result.email);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-foreground">{successMessage}</p>
        <p className="text-xs text-muted">
          Kiểm tra hộp thư đến (và thư rác) để xác minh email trước khi đăng nhập.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        label="Họ và tên"
        name="name"
        autoComplete="name"
        value={values.name}
        error={errors.name}
        onChange={(event) => update("name", event.target.value)}
        placeholder="Nguyễn Văn A"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => update("email", event.target.value)}
        placeholder="ban@dreamkit.vn"
      />
      <TextField
        label="Số điện thoại"
        name="phone"
        type="tel"
        autoComplete="tel"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => update("phone", event.target.value)}
        placeholder="0901234567"
      />
      <TextField
        label="Địa chỉ"
        name="address"
        autoComplete="street-address"
        value={values.address}
        error={errors.address}
        onChange={(event) => update("address", event.target.value)}
        placeholder="123 Đường ABC, Quận 1, TP.HCM"
      />
      <TextField
        label="Mật khẩu"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        onChange={(event) => update("password", event.target.value)}
        placeholder="Tối thiểu 6 ký tự"
      />
      <TextField
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={(event) => update("confirmPassword", event.target.value)}
        placeholder="Nhập lại mật khẩu"
      />

      <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </Button>
    </form>
  );
}
