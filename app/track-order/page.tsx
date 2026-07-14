import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { OrderTracker } from "@/components/orders/order-tracker";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng — Dreamkit",
  description: "Kiểm tra trạng thái đơn hàng Dreamkit bằng mã đơn hàng của bạn.",
};

export default function TrackOrderPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Container className="py-10">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-label text-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">Tra cứu đơn hàng</li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">
            Tra cứu đơn hàng
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted">
            Nhập mã đơn hàng bạn nhận được sau khi đặt hàng để xem trạng thái xử lý.
          </p>
        </Container>

        <Container className="pb-24">
          <Suspense fallback={null}>
            <OrderTracker />
          </Suspense>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
