"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  isValid,
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "@/lib/auth-validation";
import { TextField } from "./text-field";

const EMPTY: LoginValues = { identifier: "", password: "" };

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [values, setValues] = useState<LoginValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (isValid(nextErrors)) {
      // Real authentication is delegated to the backend integration.
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        label="Email hoặc tên tài khoản"
        name="identifier"
        autoComplete="username"
        value={values.identifier}
        error={errors.identifier}
        onChange={(event) =>
          setValues((current) => ({ ...current, identifier: event.target.value }))
        }
        placeholder="ban@dreamkit.vn"
      />
      <TextField
        label="Mật khẩu"
        name="password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={(event) =>
          setValues((current) => ({ ...current, password: event.target.value }))
        }
        placeholder="••••••••"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" name="remember" className="size-4 rounded border-border" />
          Ghi nhớ đăng nhập
        </label>
        <a href="#" className="text-xs text-foreground underline-offset-4 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full">
        Đăng nhập
      </Button>
    </form>
  );
}
