"use client";

import { useMemo } from "react";
import { countBy, countColors } from "@/lib/catalog";
import { COLOR_META } from "@/lib/products";
import type { CollarType, ColorKey, Product, ProductType } from "@/lib/types";
import { FilterGroup, type FilterOption } from "./filter-group";

const COLLAR_LABELS: Record<CollarType, string> = {
  polo: "Cổ polo",
  regular: "Cổ thường",
};

const TYPE_LABELS: Record<ProductType, string> = {
  jersey: "Áo Jersey",
  "polo-shirt": "Áo polo",
  set: "Set quần áo bóng đá",
};

interface ShopFiltersProps {
  products: readonly Product[];
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
  products,
  activeColors,
  activeCollars,
  activeTypes,
  onToggleColor,
  onToggleCollar,
  onToggleType,
  onClear,
  hasActiveFilters,
}: ShopFiltersProps) {
  const colorOptions = useMemo(() => {
    const counts = countColors(products);
    return (Object.keys(COLOR_META) as ColorKey[])
      .filter((color) => (counts.get(color) ?? 0) > 0)
      .map((color) => ({
        value: color,
        label: COLOR_META[color].label,
        count: counts.get(color) ?? 0,
        swatch: COLOR_META[color].hex,
      }));
  }, [products]);

  const collarOptions = useMemo(() => {
    const counts = countBy(products, "collar");
    return (["polo", "regular"] as CollarType[])
      .filter((value) => (counts.get(value) ?? 0) > 0)
      .map((value) => ({
        value,
        label: COLLAR_LABELS[value],
        count: counts.get(value) ?? 0,
      }));
  }, [products]);

  const typeOptions = useMemo(() => {
    const counts = countBy(products, "type");
    return (["jersey", "polo-shirt", "set"] as ProductType[])
      .filter((value) => (counts.get(value) ?? 0) > 0)
      .map((value) => ({
        value,
        label: TYPE_LABELS[value],
        count: counts.get(value) ?? 0,
      }));
  }, [products]);
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
        options={colorOptions}
        selected={activeColors}
        onToggle={onToggleColor}
      />
      <FilterGroup
        title="Cổ áo"
        options={collarOptions}
        selected={activeCollars}
        onToggle={onToggleCollar}
      />
      <FilterGroup
        title="Loại"
        options={typeOptions}
        selected={activeTypes}
        onToggle={onToggleType}
      />
    </div>
  );
}
