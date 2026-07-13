import { cn } from "@/lib/cn";

interface SpinnerProps {
  readonly className?: string;
}

/** Small inline spinner, e.g. inside a button while its request is in flight. */
export function Spinner({ className }: SpinnerProps) {
  return (
    <svg
      className={cn("size-4 animate-spin text-current", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  readonly label?: string;
}

/** Full-width placeholder shown while a section's data is loading. */
export function LoadingOverlay({ label = "Đang tải…" }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[30vh] w-full flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border py-20 text-muted"
    >
      <Spinner className="size-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
