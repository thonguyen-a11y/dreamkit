import { COLOR_META } from "@/lib/products";
import type { ColorKey } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ColorSwatchesProps {
  colors: readonly ColorKey[];
  className?: string;
}

/** Read-only row of colour dots showing the variants a product ships in. */
export function ColorSwatches({ colors, className }: ColorSwatchesProps) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)}>
      {colors.map((color) => (
        <li
          key={color}
          className="size-3.5 rounded-full border border-border"
          style={{ backgroundColor: COLOR_META[color].hex }}
          title={COLOR_META[color].label}
        >
          <span className="sr-only">{COLOR_META[color].label}</span>
        </li>
      ))}
    </ul>
  );
}
