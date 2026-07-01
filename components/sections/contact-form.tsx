"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const QUANTITY_OPTIONS = [
  { value: "lt-10", label: "Dưới 10 bộ" },
  { value: "10-20", label: "10 – 20 bộ" },
  { value: "gt-20", label: "Trên 20 bộ" },
] as const;

type QuantityValue = (typeof QUANTITY_OPTIONS)[number]["value"];

export function ContactForm() {
  const nameId = useId();
  const phoneId = useId();
  const [quantity, setQuantity] = useState<QuantityValue>("lt-10");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Wiring to a real endpoint is left to the backend integration.
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center gap-3 rounded-card bg-background p-10 text-center"
      >
        <p className="font-display text-2xl text-foreground">Cảm ơn bạn!</p>
        <p className="text-sm text-muted">
          Dreamkit sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-card bg-background p-8 shadow-sm"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-xs font-medium uppercase tracking-label text-muted">
          Tên đội bóng
        </label>
        <input
          id={nameId}
          name="team"
          required
          autoComplete="organization"
          className="h-11 rounded-card border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted/70 focus:border-foreground focus:outline-none"
          placeholder="VD: Top Dogs FC"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={phoneId} className="text-xs font-medium uppercase tracking-label text-muted">
          Số điện thoại / Zalo
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          className="h-11 rounded-card border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted/70 focus:border-foreground focus:outline-none"
          placeholder="09xx xxx xxx"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-medium uppercase tracking-label text-muted">
          Số lượng dự kiến
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {QUANTITY_OPTIONS.map((option) => {
            const isActive = quantity === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center justify-center rounded-card border px-2 py-3 text-center text-xs font-medium transition-colors ${
                  isActive
                    ? "border-foreground bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:border-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="quantity"
                  value={option.value}
                  checked={isActive}
                  onChange={() => setQuantity(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="mt-2 w-full">
        Liên hệ thiết kế ngay
      </Button>
    </form>
  );
}
