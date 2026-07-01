import { countBy, countColors } from "@/lib/catalog";
import { COLOR_META, PRODUCTS } from "@/lib/products";
import type { CollarType, ColorKey, ProductType } from "@/lib/types";
import { FilterGroup, type FilterOption } from "./filter-group";

const COLOR_COUNTS = countColors(PRODUCTS);
const COLLAR_COUNTS = countBy(PRODUCTS, "collar");
const TYPE_COUNTS = countBy(PRODUCTS, "type");

const COLOR_OPTIONS: readonly FilterOption<ColorKey>[] = (
  Object.keys(COLOR_META) as ColorKey[]
)
  .filter((color) => (COLOR_COUNTS.get(color) ?? 0) > 0)
  .map((color) => ({
    value: color,
    label: COLOR_META[color].label,
    count: COLOR_COUNTS.get(color) ?? 0,
    swatch: COLOR_META[color].hex,
  }));

const COLLAR_LABELS: Record<CollarType, string> = {
  polo: "Cổ polo",
  regular: "Cổ thường",
};

const COLLAR_OPTIONS: readonly FilterOption<CollarType>[] = (
  ["polo", "regular"] as CollarType[]
)
  .filter((value) => (COLLAR_COUNTS.get(value) ?? 0) > 0)
  .map((value) => ({
    value,
    label: COLLAR_LABELS[value],
    count: COLLAR_COUNTS.get(value) ?? 0,
  }));

const TYPE_LABELS: Record<ProductType, string> = {
  jersey: "Áo Jersey",
  "polo-shirt": "Áo polo",
  set: "Set quần áo bóng đá",
};

const TYPE_OPTIONS: readonly FilterOption<ProductType>[] = (
  ["jersey", "polo-shirt", "set"] as ProductType[]
)
  .filter((value) => (TYPE_COUNTS.get(value) ?? 0) > 0)
  .map((value) => ({
    value,
    label: TYPE_LABELS[value],
    count: TYPE_COUNTS.get(value) ?? 0,
  }));

interface ShopFiltersProps {
  activeColors: ReadonlySet<ColorKey>;
  activeCollars: ReadonlySet<CollarType>;
  activeTypes: ReadonlySet<ProductType>;
  onToggleColor: (value: ColorKey) => void;
  onToggleCollar: (value: CollarType) => void;
  onToggleType: (value: ProductType) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function ShopFilters({
  activeColors,
  activeCollars,
  activeTypes,
  onToggleColor,
  onToggleCollar,
  onToggleType,
  onClear,
  hasActiveFilters,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-label text-foreground">
          Lọc
        </h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium uppercase tracking-label text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            Xoá tất cả
          </button>
        ) : null}
      </div>

      <FilterGroup
        title="Màu sắc"
        options={COLOR_OPTIONS}
        selected={activeColors}
        onToggle={onToggleColor}
      />
      <FilterGroup
        title="Cổ áo"
        options={COLLAR_OPTIONS}
        selected={activeCollars}
        onToggle={onToggleCollar}
      />
      <FilterGroup
        title="Loại"
        options={TYPE_OPTIONS}
        selected={activeTypes}
        onToggle={onToggleType}
      />
    </div>
  );
}
