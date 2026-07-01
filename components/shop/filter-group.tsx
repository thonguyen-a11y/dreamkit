import { cn } from "@/lib/cn";

export interface FilterOption<T extends string> {
  readonly value: T;
  readonly label: string;
  readonly count: number;
  readonly swatch?: string;
}

interface FilterGroupProps<T extends string> {
  title: string;
  options: readonly FilterOption<T>[];
  selected: ReadonlySet<T>;
  onToggle: (value: T) => void;
}

/** Accessible checkbox facet group with per-option result counts. */
export function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: FilterGroupProps<T>) {
  return (
    <fieldset className="border-b border-border py-6">
      <legend className="pt-4 text-xs font-semibold uppercase tracking-label text-foreground">
        {title}
      </legend>
      <ul className="flex flex-col gap-2.5">
        {options.map((option) => {
          const isChecked = selected.has(option.value);
          return (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-muted transition-colors hover:text-foreground">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(option.value)}
                  className="size-4 rounded border-border accent-foreground"
                />
                {option.swatch ? (
                  <span
                    className="size-3.5 rounded-full border border-border"
                    style={{ backgroundColor: option.swatch }}
                    aria-hidden="true"
                  />
                ) : null}
                <span className={cn(isChecked && "font-medium text-foreground")}>
                  {option.label}
                </span>
                <span className="ml-auto text-xs text-muted">({option.count})</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
