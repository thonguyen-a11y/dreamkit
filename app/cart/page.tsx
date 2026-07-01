import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Giỏ hàng — Dreamkit",
  description: "Xem lại các sản phẩm áo đấu bạn đã thêm vào giỏ hàng Dreamkit.",
};

export default function CartPage() {
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
              <li className="text-foreground">Giỏ hàng</li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-foreground sm:text-5xl">
            Giỏ hàng
          </h1>
        </Container>

        <Container className="pb-24">
          <CartView />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
