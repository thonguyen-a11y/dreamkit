import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Render as a different element (e.g. "section", "header"). */
  as?: ElementType;
}

/** Centres content and applies the shared page gutter / max width. */
export function Container({
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-7xl px-6 lg:px-10", className)}
      {...props}
    />
  );
}
