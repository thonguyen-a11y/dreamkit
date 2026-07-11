"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/store/store-context";
import { COLOR_META } from "@/lib/products";
import {
  slugifyProductId,
  validateProduct,
  type ProductFieldErrors,
} from "@/lib/product-admin";
import { formatPrice } from "@/lib/products";
import type { CollarType, ColorKey, Product, ProductType } from "@/lib/types";
import { cn } from "@/lib/cn";

const EMPTY_PRODUCT: Product = {
  id: "",
  name: "",
  price: 210_000,
  category: "Set quần áo bóng đá",
  colors: ["black"],
  primaryColor: "black",
  image: "",
  collar: "regular",
  type: "set",
  isNew: false,
};

const COLOR_OPTIONS = Object.keys(COLOR_META) as ColorKey[];
const COLLAR_OPTIONS: CollarType[] = ["regular", "polo"];
const TYPE_OPTIONS: ProductType[] = ["set", "jersey", "polo-shirt"];

export function ProductManager() {
  const { products, upsertProduct, deleteProduct, resetProducts } = useStore();
  const [draft, setDraft] = useState<Product>(EMPTY_PRODUCT);
  const [originalId, setOriginalId] = useState<string | undefined>();
  const [errors, setErrors] = useState<ProductFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);

  const isEditing = Boolean(originalId);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name, "vi")),
    [products],
  );

  function startCreate() {
    setDraft(EMPTY_PRODUCT);
    setOriginalId(undefined);
    setErrors({});
    setMessage(null);
  }

  function startEdit(product: Product) {
    setDraft(product);
    setOriginalId(product.id);
    setErrors({});
    setMessage(null);
  }

  function updateDraft<K extends keyof Product>(field: K, value: Product[K]) {
    setDraft((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && !originalId) {
        next.id = slugifyProductId(String(value));
      }
      return next;
    });
  }

  function toggleColor(color: ColorKey) {
    setDraft((current) => {
      const hasColor = current.colors.includes(color);
      const colors = hasColor
        ? current.colors.filter((entry) => entry !== color)
        : [...current.colors, color];
      return { ...current, colors };
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProduct(draft, products, originalId);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const saved = upsertProduct(draft, originalId);
    if (!saved) {
      setMessage("Không thể lưu sản phẩm. Vui lòng kiểm tra lại thông tin.");
      return;
    }

    setMessage(isEditing ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.");
    startCreate();
  }

  function handleDelete(id: string) {
    if (window.confirm("Xoá sản phẩm này?")) {
      deleteProduct(id);
      if (originalId === id) {
        startCreate();
      }
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Sản phẩm</h1>
          <p className="mt-2 text-sm text-muted">
            Quản lý danh mục sản phẩm hiển thị trên cửa hàng.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={startCreate}>
            Thêm mới
          </Button>
          <Button type="button" variant="ghost" onClick={resetProducts}>
            Khôi phục mặc định
          </Button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-card border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-label text-muted">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Loại</th>
                  <th className="px-4 py-3">Mới</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-card border border-border">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">{formatPrice(product.price)}</td>
                    <td className="px-4 py-4">{product.type}</td>
                    <td className="px-4 py-4">{product.isNew ? "Có" : "Không"}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(product)}
                          className="text-xs font-medium uppercase tracking-label text-foreground underline-offset-4 hover:underline"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-medium uppercase tracking-label text-muted underline-offset-4 hover:text-foreground hover:underline"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-card border border-border bg-surface p-6">
          <h2 className="font-display text-xl text-foreground">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
          </h2>
          {message ? <p className="mt-3 text-sm text-highlight">{message}</p> : null}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field label="Mã sản phẩm" error={errors.id}>
              <input
                value={draft.id}
                onChange={(event) => updateDraft("id", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Tên sản phẩm" error={errors.name}>
              <input
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Giá (VND)" error={errors.price}>
              <input
                type="number"
                min={0}
                value={draft.price}
                onChange={(event) => updateDraft("price", Number(event.target.value))}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Danh mục" error={errors.category}>
              <input
                value={draft.category}
                onChange={(event) => updateDraft("category", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Ảnh (URL)" error={errors.image}>
              <input
                value={draft.image}
                onChange={(event) => updateDraft("image", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field label="Màu chính" error={errors.primaryColor}>
              <select
                value={draft.primaryColor}
                onChange={(event) =>
                  updateDraft("primaryColor", event.target.value as ColorKey)
                }
                className={INPUT_CLASS}
              >
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {COLOR_META[color].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Màu sắc" error={errors.colors}>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => {
                  const active = draft.colors.includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleColor(color)}
                      className={cn(
                        "rounded-card border px-3 py-1.5 text-xs",
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted",
                      )}
                    >
                      {COLOR_META[color].label}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Cổ áo" error={errors.collar}>
                <select
                  value={draft.collar}
                  onChange={(event) =>
                    updateDraft("collar", event.target.value as CollarType)
                  }
                  className={INPUT_CLASS}
                >
                  {COLLAR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Loại" error={errors.type}>
                <select
                  value={draft.type}
                  onChange={(event) =>
                    updateDraft("type", event.target.value as ProductType)
                  }
                  className={INPUT_CLASS}
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.isNew}
                onChange={(event) => updateDraft("isNew", event.target.checked)}
                className="size-4 rounded border-border"
              />
              Đánh dấu là sản phẩm mới
            </label>
            <Button type="submit" className="mt-2">
              {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

const INPUT_CLASS =
  "h-11 w-full rounded-card border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-foreground";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-label text-muted">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
