"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { contactFormSchema, type ContactFormType } from "@/components/schemas/contact-form.schema";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast-context";
import { submitContactApi } from "@/lib/contacts-api";

const QUANTITY_OPTIONS = [
  { value: "lt_10m", label: "Dưới 10 bộ" },
  { value: "10m_20m", label: "10 – 20 bộ" },
  { value: "gt_20m", label: "Trên 20 bộ" },
] as const;

type EstimateAmountValue = (typeof QUANTITY_OPTIONS)[number]["value"];

const QUANTITY_LABELS: Record<EstimateAmountValue, string> = Object.fromEntries(
  QUANTITY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<EstimateAmountValue, string>;

/** No email field is collected; synthesize one so the backend's required email accepts the lead. */
function buildPlaceholderEmail(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "") || Date.now().toString();
  return `lead-${digits}@dreamkit.vn`;
}

export function ContactForm() {
  const nameId = useId();
  const phoneId = useId();
  const [estimateAmount, setEstimateAmount] = useState<EstimateAmountValue>("lt_10m");
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      teamName: "",
      phoneNumber: "",
      estimateAmount: "lt_10m",
    },
  });
  const { showToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ContactFormType) => {
    setIsSubmitting(true);

    const result = await submitContactApi({
      name: data.teamName.trim(),
      email: buildPlaceholderEmail(data.phoneNumber),
      phone: data.phoneNumber.trim(),
      message: `Số lượng dự kiến: ${QUANTITY_LABELS[data.estimateAmount]}`,
    });

    setIsSubmitting(false);

    if (result.ok) {
      setIsSubmitted(true);
    } else {
      showToast(result.message, "error");
    }
  };


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
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-card bg-background p-8 shadow-sm"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-xs font-medium uppercase tracking-label text-muted">
          Tên đội bóng
        </label>
        <input
          id={nameId}
          {...register("teamName")}
          name="teamName"
          autoComplete="organization"
          className="h-11 rounded-card border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted/70 focus:border-foreground focus:outline-none"
          placeholder="VD: Top Dogs FC"
        />
        {errors.teamName && <p className="text-sm text-red-500">{errors.teamName.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={phoneId} className="text-xs font-medium uppercase tracking-label text-muted">
          Số điện thoại / Zalo
        </label>
        <input
          id={phoneId}
          {...register("phoneNumber")}
          name="phoneNumber"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          className="h-11 rounded-card border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted/70 focus:border-foreground focus:outline-none"
          placeholder="09xx xxx xxx"
        />
        {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-medium uppercase tracking-label text-muted">
          Số lượng dự kiến
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {QUANTITY_OPTIONS.map((option) => {
            const isActive = estimateAmount === option.value;
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
                  {...register("estimateAmount")}
                  name="estimateAmount"
                  value={option.value}
                  checked={isActive}
                  onChange={() => setEstimateAmount(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="mt-2 w-full hover:cursor-pointer" disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : null}
        {isSubmitting ? "Đang gửi..." : "Liên hệ thiết kế ngay"}
      </Button>
    </form>
  );
}
