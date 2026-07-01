import { useId, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface TextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
}

/** Labeled input with inline validation messaging and ARIA wiring. */
export function TextField({ label, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-xs font-medium uppercase tracking-label text-muted">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-11 rounded-card border bg-surface px-4 text-sm text-foreground placeholder:text-muted/70 focus:outline-none",
          error ? "border-red-500 focus:border-red-500" : "border-border focus:border-foreground",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
