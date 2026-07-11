"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/components/store/store-context";
import { formatPrice } from "@/lib/products";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

export function AdminDashboard() {
  const { products, orders } = useStore();

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders],
  );

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "cancelled")
        .reduce((total, order) => total + order.total, 0),
    [orders],
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Tổng quan</h1>
        <p className="mt-2 text-sm text-muted">
          Theo dõi nhanh số lượng sản phẩm, đơn hàng và doanh thu.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sản phẩm" value={String(products.length)} href="/admin/products" />
        <StatCard label="Đơn hàng" value={String(orders.length)} href="/admin/orders" />
        <StatCard label="Chờ xác nhận" value={String(pendingOrders)} href="/admin/orders" />
        <StatCard label="Doanh thu" value={formatPrice(revenue)} />
      </div>

      <section className="rounded-card border border-border bg-surface p-6">
        <h2 className="font-display text-xl text-foreground">Đơn hàng gần đây</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Chưa có đơn hàng nào.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex text-xs font-medium uppercase tracking-label text-foreground underline-offset-4 hover:underline"
        >
          Xem tất cả đơn hàng
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-card border border-border bg-surface p-6">
      <p className="text-xs uppercase tracking-label text-muted">{label}</p>
      <p className="mt-3 font-display text-3xl text-foreground">{value}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80">
        {content}
      </Link>
    );
  }

  return content;
}
