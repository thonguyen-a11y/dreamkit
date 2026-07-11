"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  isValid,
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "@/lib/auth-validation";
import type { AuthUser } from "@/lib/types";
import { useAuthModal } from "./auth-modal-context";
import { TextField } from "./text-field";

const EMPTY: LoginValues = { email: "", password: "" };

interface LoginFormProps {
  onSuccess: (user: AuthUser) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { authenticate, login } = useAuthModal();
  const [values, setValues] = useState<LoginValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setFormError(null);

    if (!isValid(nextErrors)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authenticate(values);
      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      login(result.session);
      onSuccess(result.session.user);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(event) =>
          setValues((current) => ({ ...current, email: event.target.value }))
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

      {formError ? <p className="text-xs text-red-600">{formError}</p> : null}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" name="remember" className="size-4 rounded border-border" />
          Ghi nhớ mật khẩu
        </label>
        <a href="#" className="text-xs text-foreground underline-offset-4 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
