"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  isValid,
  validateRegister,
  type FieldErrors,
  type RegisterValues,
} from "@/lib/auth-validation";
import { TextField } from "./text-field";

const EMPTY: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<RegisterValues>>({});

  function update(field: keyof RegisterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    if (isValid(nextErrors)) {
      onSuccess();
    }
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

      <Button type="submit" size="lg" className="mt-1 w-full">
        Tạo tài khoản
      </Button>
    </form>
  );
}
