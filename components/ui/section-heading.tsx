import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** Small uppercase label rendered above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent editorial section header (eyebrow + serif title + lede). */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-medium uppercase tracking-label text-highlight">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
