"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/products";
import { cn } from "@/lib/cn";
import type { CartDetailLine } from "@/lib/cart";
import { useCart } from "./cart-context";

const LINK_BUTTON_CLASS =
  "inline-flex h-11 items-center justify-center rounded-card bg-accent px-6 text-xs font-medium uppercase tracking-label text-accent-foreground transition-colors hover:bg-foreground/85";

export function CartView() {
  const { items, subtotal, count, removeItem, setQuantity, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-card border border-dashed border-border py-24 text-center">
        <p className="font-display text-2xl text-foreground">
          Giỏ hàng của bạn đang trống
        </p>
        <p className="max-w-sm text-sm text-muted">
          Chưa có sản phẩm nào trong giỏ hàng. Khám phá các mẫu áo đấu của
          Dreamkit và thêm vào giỏ.
        </p>
        <Link href="/shop" className={cn("mt-2", LINK_BUTTON_CLASS)}>
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <section aria-label="Sản phẩm trong giỏ" className="flex flex-col">
        <ul className="border-t border-border">
          {items.map((line) => (
            <CartRow
              key={line.product.id}
              line={line}
              onRemove={() => removeItem(line.product.id)}
              onQuantityChange={(quantity) =>
                setQuantity(line.product.id, quantity)
              }
            />
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-xs font-medium uppercase tracking-label text-foreground underline-offset-4 hover:underline"
          >
            ← Tiếp tục mua sắm
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium uppercase tracking-label text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            Xoá giỏ hàng
          </button>
        </div>
      </section>

      <aside aria-label="Tổng đơn hàng" className="h-fit rounded-card border border-border bg-surface p-8">
        <h2 className="font-display text-xl text-foreground">Tổng đơn hàng</h2>
        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted">Tạm tính ({count} sản phẩm)</dt>
            <dd className="font-medium text-foreground">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd className="text-muted">Tính khi thanh toán</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
          <span className="text-sm font-semibold uppercase tracking-label text-foreground">
            Tổng cộng
          </span>
          <span className="font-display text-2xl text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>
        <Button size="lg" className="mt-6 w-full">
          Tiến hành thanh toán
        </Button>
      </aside>
    </div>
  );
}

interface CartRowProps {
  line: CartDetailLine;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

function CartRow({ line, onRemove, onQuantityChange }: CartRowProps) {
  const { product, quantity, lineTotal } = line;

  return (
    <li className="flex gap-4 border-b border-border py-6">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-card border border-border bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-sm font-medium leading-snug text-foreground">
            {product.name}
          </h3>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Xoá ${product.name}`}
            className="shrink-0 text-muted transition-colors hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-muted">{formatPrice(product.price)}</p>

        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper quantity={quantity} onChange={onQuantityChange} />
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  );
}

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-card border border-border">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Giảm số lượng"
        className="flex size-9 items-center justify-center text-foreground hover:bg-surface-strong"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium text-foreground" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Tăng số lượng"
        className="flex size-9 items-center justify-center text-foreground hover:bg-surface-strong"
      >
        +
      </button>
    </div>
  );
}
